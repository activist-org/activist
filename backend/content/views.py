# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
from typing import Any

from django.db.models import Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework import status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response

from content.models import Discussion, DiscussionEntry, Image, Resource
from content.serializers import (
    DiscussionEntrySerializer,
    DiscussionSerializer,
    ImageSerializer,
    ResourceSerializer,
)
from core.paginator import CustomPagination
from core.settings import (
    CACHE_DURATION,
    DISCUSSION_LIST_CACHE_PREFIX,
    DISCUSSION_RETRIEVE_CACHE_PREFIX,
    DISCUSSIONENTRY_LIST_CACHE_PREFIX,
    DISCUSSIONENTRY_RETRIEVE_CACHE_PREFIX,
    RESOURCE_LIST_CACHE_PREFIX,
    RESOURCE_RETRIEVE_CACHE_PREFIX,
)

# MARK: Main Tables


class DiscussionViewSet(viewsets.ModelViewSet[Discussion]):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            request.data["created_by"] = request.user
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a discussion."},
            status=status.HTTP_403_FORBIDDEN,
        )

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=DISCUSSION_RETRIEVE_CACHE_PREFIX)
    )
    @vary_on_cookie
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=DISCUSSION_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(is_private=False) | Q(is_private=True, created_by=request.user)
            )

        else:
            query = self.queryset.filter()

        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        """
        Just the created_by user can update the discussion.
        """
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, pk: str | None = None) -> Response:
        """
        Deleted the whole discussion - requires created_by user.
        """
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to delete this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceViewSet(viewsets.ModelViewSet[Resource]):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a resource."},
            status=status.HTTP_403_FORBIDDEN,
        )

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=RESOURCE_RETRIEVE_CACHE_PREFIX)
    )
    @vary_on_cookie
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if request.user.is_authenticated:
            if pk is not None:
                query = self.queryset.filter(
                    Q(is_private=False) | Q(is_private=True, created_by=request.user),
                    id=pk,
                )

            else:
                return Response(
                    {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
                )

        else:
            if pk is not None:
                query = self.queryset.filter(Q(is_private=False), id=pk)

            else:
                return Response(
                    {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
                )

        serializer = self.get_serializer(query)

        return Response(serializer.data)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=RESOURCE_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(is_private=False) | Q(is_private=True, created_by=request.user)
            )
        else:
            query = self.queryset.filter(is_private=False)

        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to delete this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


# MARK: Bridge Tables


class DiscussionEntryViewSet(viewsets.ModelViewSet[DiscussionEntry]):
    queryset = DiscussionEntry.objects.all()
    serializer_class = DiscussionEntrySerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            request.data["created_by"] = request.user
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a discussion entry."},
            status=status.HTTP_403_FORBIDDEN,
        )

    @method_decorator(
        cache_page(
            CACHE_DURATION * 60, key_prefix=DISCUSSIONENTRY_RETRIEVE_CACHE_PREFIX
        )
    )
    @vary_on_cookie
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=DISCUSSIONENTRY_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(is_private=False) | Q(is_private=True, created_by=request.user)
            )

        else:
            query = self.queryset.filter()

        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this discussion entry."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to update this discussion entry."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()

        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to delete this discussion entry."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    # Using 'Any' type until a more correct type is determined.
    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},  # pass request to serializer
        )
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
