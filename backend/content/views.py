# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for content management.
"""

from typing import Any

from django.db.models import Q
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

# MARK: Main Tables


class DiscussionViewSet(viewsets.ModelViewSet[Discussion]):
    """
    Viewset for CRUD operations on Discussion objects.
    """

    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        """
        Create a new discussion with the authenticated user as creator.

        Parameters
        ----------
        request : Request
            HTTP request containing discussion data.

        Returns
        -------
        Response
            Response with created discussion data or error message.
        """
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

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        """
        Retrieve a specific discussion by ID.

        Parameters
        ----------
        request : Request
            HTTP request object.
        pk : str or None
            Primary key of the discussion to retrieve.

        Returns
        -------
        Response
            Response with discussion data or error message.
        """
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request: Request) -> Response:
        """
        List all discussions with privacy filtering based on authentication.

        Parameters
        ----------
        request : Request
            HTTP request object.

        Returns
        -------
        Response
            Paginated response with filtered discussions.
        """
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
        Update a discussion if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with updated discussion data.
        pk : str or None
            Primary key of the discussion to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the discussion can update it.
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
        """
        Partially update a discussion if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with partial discussion data.
        pk : str or None
            Primary key of the discussion to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the discussion can update it.
        """
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
        Delete a discussion if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request object.
        pk : str or None
            Primary key of the discussion to delete.

        Returns
        -------
        Response
            Empty response on success or error message.

        Notes
        -----
        Only the user who created the discussion can delete it.
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
    """
    Viewset for CRUD operations on Resource objects.
    """

    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination

    def create(self, request: Request) -> Response:
        """
        Create a new resource.

        Parameters
        ----------
        request : Request
            HTTP request containing resource data.

        Returns
        -------
        Response
            Response with created resource data or error message.
        """
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a resource."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        """
        Retrieve a specific resource by ID.

        Parameters
        ----------
        request : Request
            HTTP request object.
        pk : str or None
            Primary key of the resource to retrieve.

        Returns
        -------
        Response
            Response with resource data or error message.

        Notes
        -----
        Privacy settings are enforced - authenticated users can see their own
        private resources and all public resources, while unauthenticated users
        can only see public resources.
        """
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

    def list(self, request: Request) -> Response:
        """
        List all resources.

        Parameters
        ----------
        request : Request
            HTTP request object.

        Returns
        -------
        Response
            Paginated response with filtered resources.

        Notes
        -----
        Authenticated users can see public resources and their own private ones.
        Unauthenticated users can only see public resources.
        """
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(is_private=False) | Q(is_private=True, created_by=request.user)
            )
        else:
            query = self.queryset.filter(is_private=False)

        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        """
        Update a resource if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with updated resource data.
        pk : str or None
            Primary key of the resource to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the resource can update it.
        """
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
        """
        Partially update a resource if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with partial resource data.
        pk : str or None
            Primary key of the resource to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the resource can update it.
        """
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
    """
    Viewset for operations on DiscussionEntry objects.
    """

    queryset = DiscussionEntry.objects.all()
    serializer_class = DiscussionEntrySerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        """
        Create a new discussion entry with the authenticated user as creator.

        Parameters
        ----------
        request : Request
            HTTP request containing discussion entry data.

        Returns
        -------
        Response
            Response with created discussion entry data or error message.
        """
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

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        """
        Retrieve a specific discussion entry by ID.

        Parameters
        ----------
        request : Request
            HTTP request object.
        pk : str or None
            Primary key of the discussion entry to retrieve.

        Returns
        -------
        Response
            Response with discussion entry data or error message.
        """
        queryset = self.get_queryset()
        if pk is not None:
            item = queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(item)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request: Request) -> Response:
        """
        List all discussion entries.

        Parameters
        ----------
        request : Request
            HTTP request object.

        Returns
        -------
        Response
            Paginated response with discussion entries.
        """
        query = self.queryset.filter()
        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        """
        Update a discussion entry if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with updated discussion entry data.
        pk : str or None
            Primary key of the discussion entry to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the discussion entry can update it.
        """
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
        """
        Partially update a discussion entry if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with partial discussion entry data.
        pk : str or None
            Primary key of the discussion entry to update.

        Returns
        -------
        Response
            Response with updated data or error message.

        Notes
        -----
        Only the user who created the discussion entry can update it.
        """
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
        """
        Delete a discussion entry if the user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request object.
        pk : str or None
            Primary key of the discussion entry to delete.

        Returns
        -------
        Response
            Empty response on success or error message.

        Notes
        -----
        Only the user who created the discussion entry can delete it.
        """
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to delete this discussion entry."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)

        return Response(status=status.HTTP_204_NO_CONTENT)


class ImageViewSet(viewsets.ModelViewSet[Image]):
    """
    Viewset for operations on Image objects.
    """

    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Upload and create a new image.

        Parameters
        ----------
        request : Request
            HTTP request containing image file data.
        *args : Any
            Variable positional arguments.
        **kwargs : Any
            Variable keyword arguments.

        Returns
        -------
        Response
            Response with created image data or error message.

        Notes
        -----
        Handles file upload through multipart form data.
        Passes request context to serializer for proper file handling.
        """
        serializer = self.get_serializer(
            data=request.data,
            context={"request": request},  # pass request to serializer
        )
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Use the default destroy() provided by DRF / ModelViewSet. No need to write destroy() code here.
    # The model uses a signal to delete the file from the filesystem when the Image instance is deleted.
