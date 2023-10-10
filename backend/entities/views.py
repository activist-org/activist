from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

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

    def create(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            data = {"message": f"New Organization created with id: {instance.id}"}
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Organization, pk=kwargs["pk"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Organization, pk=kwargs["pk"])
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            data = {"message": f'Organization {kwargs["pk"]} has been updated'}
            return Response(data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Organization, pk=kwargs["pk"])
        instance.delete()
        data = {"message": f'Organization {kwargs["pk"]} has been deleted successfully'}
        return Response(data, status=status.HTTP_204_NO_CONTENT)


class OrganizationApplicationStatusViewSet(
    viewsets.ModelViewSet[OrganizationApplicationStatus]
):
    queryset = OrganizationApplicationStatus.objects.all()
    serializer_class = OrganizationApplicationStatusSerializer


class OrganizationApplicationViewSet(viewsets.ModelViewSet[OrganizationApplication]):
    queryset = OrganizationApplication.objects.all()
    serializer_class = OrganizationApplicationSerializer


class OrganizationEventViewSet(viewsets.ModelViewSet[OrganizationEvent]):
    queryset = OrganizationEvent.objects.all()
    serializer_class = OrganizationEventSerializer


class OrganizationMemberViewSet(viewsets.ModelViewSet[OrganizationMember]):
    queryset = OrganizationMember.objects.all()
    serializer_class = OrganizationMemberSerializer


class OrganizationResourceViewSet(viewsets.ModelViewSet[OrganizationResource]):
    queryset = OrganizationResource.objects.all()
    serializer_class = OrganizationResourceSerializer


class GroupViewSet(viewsets.ModelViewSet[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class OrganizationTaskViewSet(viewsets.ModelViewSet[OrganizationTask]):
    queryset = OrganizationTask.objects.all()
    serializer_class = OrganizationTaskSerializer


class OrganizationTopicViewSet(viewsets.ModelViewSet[OrganizationTopic]):
    queryset = OrganizationTopic.objects.all()
    serializer_class = OrganizationTopicSerializer


class GroupEventViewSet(viewsets.ModelViewSet[GroupEvent]):
    queryset = GroupEvent.objects.all()
    serializer_class = GroupEventSerializer


class GroupMemberViewSet(viewsets.ModelViewSet[GroupMember]):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer


class GroupResourceViewSet(viewsets.ModelViewSet[GroupResource]):
    queryset = GroupResource.objects.all()
    serializer_class = GroupResourceSerializer


class GroupTopicViewSet(viewsets.ModelViewSet[GroupTopic]):
    queryset = GroupTopic.objects.all()
    serializer_class = GroupTopicSerializer
