# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for content management.
"""

from typing import Any
from uuid import UUID

from django.db import IntegrityError, OperationalError
from django.db.models import Q
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.request import Request
from rest_framework.response import Response

from content.models import Discussion, DiscussionEntry, Image, Resource, ResourceFlag
from content.serializers import (
    DiscussionEntrySerializer,
    DiscussionSerializer,
    ImageSerializer,
    ResourceFlagSerializer,
    ResourceSerializer,
)
from core.paginator import CustomPagination
from core.permissions import IsAdminStaffCreatorOrReadOnly

# MARK: Discussion


class DiscussionViewSet(viewsets.ModelViewSet[Discussion]):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"detail": "You are not allowed to create a discussion."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"detail": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

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
                {"detail": "You are not allowed to update this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"detail": "You are not allowed to update this discussion."},
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
                {"detail": "You are not allowed to delete this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


# MARK: Discussion Entry


class DiscussionEntryViewSet(viewsets.ModelViewSet[DiscussionEntry]):
    queryset = DiscussionEntry.objects.all()
    serializer_class = DiscussionEntrySerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"detail": "You are not allowed to create a discussion entry."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"detail": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request: Request) -> Response:
        query = self.queryset.filter()
        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"detail": "You are not allowed to update this discussion entry."},
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
                {"detail": "You are not allowed to update this discussion entry."},
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
                {"detail": "You are not allowed to delete this discussion entry."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


# MARK: Resource


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
            {"detail": "You are not allowed to create a resource."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if pk is not None:
            try:
                query = self.queryset.get(
                    Q(is_private=False) | Q(is_private=True, created_by=request.user),
                    id=pk,
                )
            except Resource.DoesNotExist:
                return Response(
                    {"detail": "Resource not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        serializer = self.get_serializer(query)
        return Response(serializer.data)

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
                {"detail": "You are not allowed to update this resource."},
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
                {"detail": "You are not allowed to update this resource."},
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
                {"detail": "You are not allowed to delete this resource."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


# MARK: Resource Flag


class ResourceFlagAPIView(GenericAPIView[ResourceFlag]):
    queryset = ResourceFlag.objects.all()
    serializer_class = ResourceFlagSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: ResourceSerializer(many=True)})
    def get(self, request: Request) -> Response:
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            201: ResourceFlagSerializer,
            400: OpenApiResponse(response={"detail": "Failed to create flag."}),
        }
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(created_by=request.user)

        except (IntegrityError, OperationalError):
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ResourceFlagDetailAPIView(GenericAPIView[ResourceFlag]):
    queryset = ResourceFlag.objects.all()
    serializer_class = ResourceFlagSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

    @extend_schema(
        responses={
            200: ResourceFlagSerializer,
            404: OpenApiResponse(
                response={"detail": "Failed to retrieve the resource flag."}
            ),
        }
    )
    def get(self, request: Request, id: str | UUID) -> Response:
        try:
            flag = ResourceFlag.objects.get(id=id)

        except ResourceFlag.DoesNotExist:
            return Response(
                {"detail": "Failed to retrieve the flag."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, flag)

        serializer = ResourceFlagSerializer(flag)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            204: OpenApiResponse(response={"message": "Flag deleted successfully."}),
            401: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            403: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            404: OpenApiResponse(response={"detail": "Failed to retrieve flag."}),
        }
    )
    def delete(self, request: Request, id: UUID | str) -> Response:
        try:
            flag = ResourceFlag.objects.get(id=id)

        except ResourceFlag.DoesNotExist:
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()
        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


# MARK: Image


class ImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},
        )
        if serializer.is_valid():
            images = serializer.save()  # returns a list of images

            # We need to serialize the list of images.
            response_serializer = self.get_serializer(images, many=True)

            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Use the default destroy() provided by DRF / ModelViewSet. No need to write destroy() code here.
    # The model uses a signal to delete the file from the filesystem when the Image instance is deleted.
