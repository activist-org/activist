# mypy: disable-error-code="override"
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from backend.paginator import CustomPagination

from .models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Resource,
    ResourceTopic,
    Task,
    Topic,
    TopicFormat,
)
from .serializers import (
    DiscussionEntrySerializer,
    DiscussionSerializer,
    FaqSerializer,
    ImageSerializer,
    ResourceSerializer,
    ResourceTopicSerializer,
    TaskSerializer,
    TopicFormatSerializer,
    TopicSerializer,
)


class DiscussionViewSet(viewsets.ModelViewSet[Discussion]):
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
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

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        item = queryset.filter(id=pk).first()

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(private=False) | Q(private=True, created_by=request.user)
            )
        else:
            query = self.queryset.filter()

        serializer = self.get_serializer(query, many=True)
        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        """Just the created_by user can update the discussion"""
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
        Deleted the whole discussion
        - Only the created_by user can delete it
        """
        item = self.get_object()
        if item.created_by != request.user:
            return Response(
                {"error": "You are not allowed to delete this discussion."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)
        return Response(status=status.HTTP_204_NO_CONTENT)


class DiscussionEntryViewSet(viewsets.ModelViewSet[DiscussionEntry]):
    queryset = DiscussionEntry.objects.all()
    serializer_class = DiscussionEntrySerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            request.data["user_id"] = request.user
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a discussion entry."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        queryset = self.get_queryset()
        item = queryset.filter(id=pk).first()

        serializer = self.get_serializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(private=False) | Q(private=True, created_by=request.user)
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


class FaqViewSet(viewsets.ModelViewSet[Faq]):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    pagination_class = CustomPagination


class ImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    pagination_class = CustomPagination


class ResourceViewSet(viewsets.ModelViewSet[Resource]):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    permission_classes = [IsAuthenticatedOrReadOnly]

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

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(private=False) | Q(private=True, created_by=request.user), id=pk
            )
        else:
            query = self.queryset.filter(Q(private=False), id=pk)

        serializer = self.get_serializer(query)
        return Response(serializer.data)

    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(private=False) | Q(private=True, created_by=request.user)
            )
        else:
            query = self.queryset.filter(private=False)

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


class TaskViewSet(viewsets.ModelViewSet[Task]):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = CustomPagination


class TopicViewSet(viewsets.ModelViewSet[Topic]):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    pagination_class = CustomPagination


class ResourceTopicViewSet(viewsets.ModelViewSet[ResourceTopic]):
    queryset = ResourceTopic.objects.all()
    serializer_class = ResourceTopicSerializer
    pagination_class = CustomPagination


class TopicFormatViewSet(viewsets.ModelViewSet[TopicFormat]):
    queryset = TopicFormat.objects.all()
    serializer_class = TopicFormatSerializer
    pagination_class = CustomPagination
