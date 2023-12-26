from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from backend.paginator import CustomPagination

from .models import (
    Group,
    GroupEvent,
    GroupMember,
    GroupResource,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationApplicationStatus,
    OrganizationEvent,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationTopic,
)
from .serializers import (
    GroupEventSerializer,
    GroupMemberSerializer,
    GroupResourceSerializer,
    GroupSerializer,
    GroupTopicSerializer,
    OrganizationApplicationSerializer,
    OrganizationApplicationStatusSerializer,
    OrganizationEventSerializer,
    OrganizationMemberSerializer,
    OrganizationResourceSerializer,
    OrganizationSerializer,
    OrganizationTaskSerializer,
    OrganizationTopicSerializer,
)


class OrganizationViewSet(viewsets.ModelViewSet[Organization]):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to create a organization."},
            status=status.HTTP_403_FORBIDDEN,
        )

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(created_by=request.user), id=pk
            )
        else:
            query = self.queryset.filter(id=pk)

        serializer = self.get_serializer(query)
        return Response(serializer.data)

    def list(self, request: Request) -> Response:
        if request.user.is_authenticated:
            query = self.queryset.filter(
                Q(created_by=request.user)
            )
        else:
            query = self.queryset

        serializer = self.get_serializer(query, many=True)
        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def update(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if not item.created_by == request.user:
            return Response(
                {"error": "You are not allowed to update this organization."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(item, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        item = self.get_object()
        if not item.created_by == request.user:
            return Response(
                {"error": "You are not allowed to update this organization."},
                status=status.HTTP_403_FORBIDDEN,
            )
        serializer = self.get_serializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, pk: str | None = None) -> Response:
        item = self.get_object()
        if not item.created_by == request.user:
            return Response(
                {"error": "You are not allowed to delete this organization."},
                status=status.HTTP_403_FORBIDDEN,
            )

        self.perform_destroy(item)
        return Response(status=status.HTTP_204_NO_CONTENT)


class OrganizationApplicationStatusViewSet(
    viewsets.ModelViewSet[OrganizationApplicationStatus]
):
    queryset = OrganizationApplicationStatus.objects.all()
    serializer_class = OrganizationApplicationStatusSerializer
    pagination_class = CustomPagination


class OrganizationApplicationViewSet(viewsets.ModelViewSet[OrganizationApplication]):
    queryset = OrganizationApplication.objects.all()
    serializer_class = OrganizationApplicationSerializer
    pagination_class = CustomPagination


class OrganizationEventViewSet(viewsets.ModelViewSet[OrganizationEvent]):
    queryset = OrganizationEvent.objects.all()
    serializer_class = OrganizationEventSerializer
    pagination_class = CustomPagination


class OrganizationMemberViewSet(viewsets.ModelViewSet[OrganizationMember]):
    queryset = OrganizationMember.objects.all()
    serializer_class = OrganizationMemberSerializer
    pagination_class = CustomPagination


class OrganizationResourceViewSet(viewsets.ModelViewSet[OrganizationResource]):
    queryset = OrganizationResource.objects.all()
    serializer_class = OrganizationResourceSerializer
    pagination_class = CustomPagination


class GroupViewSet(viewsets.ModelViewSet[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = CustomPagination


class OrganizationTaskViewSet(viewsets.ModelViewSet[OrganizationTask]):
    queryset = OrganizationTask.objects.all()
    serializer_class = OrganizationTaskSerializer
    pagination_class = CustomPagination


class OrganizationTopicViewSet(viewsets.ModelViewSet[OrganizationTopic]):
    queryset = OrganizationTopic.objects.all()
    serializer_class = OrganizationTopicSerializer
    pagination_class = CustomPagination


class GroupEventViewSet(viewsets.ModelViewSet[GroupEvent]):
    queryset = GroupEvent.objects.all()
    serializer_class = GroupEventSerializer
    pagination_class = CustomPagination


class GroupMemberViewSet(viewsets.ModelViewSet[GroupMember]):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    pagination_class = CustomPagination


class GroupResourceViewSet(viewsets.ModelViewSet[GroupResource]):
    queryset = GroupResource.objects.all()
    serializer_class = GroupResourceSerializer
    pagination_class = CustomPagination


class GroupTopicViewSet(viewsets.ModelViewSet[GroupTopic]):
    queryset = GroupTopic.objects.all()
    serializer_class = GroupTopicSerializer
    pagination_class = CustomPagination
