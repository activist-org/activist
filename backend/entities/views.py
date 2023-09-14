from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response

from .models import (
    Organization, 
    OrganizationApplicationStatus, 
    OrganizationApplication,
    OrganizationEvent, 
    OrganizationMember, 
    OrganizationResource, 
    Group,
    OrganizationTask, 
    OrganizationTopic, 
    GroupEvent, 
    GroupMember,
    GroupResource, 
    GroupTopic
)

from .serializers import (
    OrganizationSerializer,
    OrganizationApplicationStatusSerializer, 
    OrganizationApplicationSerializer,
    OrganizationEventSerializer, 
    OrganizationMemberSerializer, 
    OrganizationResourceSerializer, 
    GroupSerializer,
    OrganizationTaskSerializer, 
    OrganizationTopicSerializer, 
    GroupEventSerializer, 
    GroupMemberSerializer,
    GroupResourceSerializer, 
    GroupTopicSerializer
    )


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class OrganizationApplicationStatusViewSet(viewsets.ModelViewSet):
    queryset = OrganizationApplicationStatus.objects.all()
    serializer_class = OrganizationApplicationStatusSerializer

class OrganizationApplicationViewSet(viewsets.ModelViewSet):
    queryset = OrganizationApplication.objects.all()
    serializer_class = OrganizationApplicationSerializer

class OrganizationEventViewSet(viewsets.ModelViewSet):
    queryset = OrganizationEvent.objects.all()
    serializer_class = OrganizationEventSerializer

class OrganizationMemberViewSet(viewsets.ModelViewSet):
    queryset = OrganizationMember.objects.all()
    serializer_class = OrganizationMemberSerializer

class OrganizationResourceViewSet(viewsets.ModelViewSet):
    queryset = OrganizationResource.objects.all()
    serializer_class = OrganizationResourceSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class OrganizationTaskViewSet(viewsets.ModelViewSet):
    queryset = OrganizationTask.objects.all()
    serializer_class = OrganizationTaskSerializer

class OrganizationTopicViewSet(viewsets.ModelViewSet):
    queryset = OrganizationTopic.objects.all()
    serializer_class = OrganizationTopicSerializer

class GroupEventViewSet(viewsets.ModelViewSet):
    queryset = GroupEvent.objects.all()
    serializer_class = GroupEventSerializer

class GroupMemberViewSet(viewsets.ModelViewSet):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer

class GroupResourceViewSet(viewsets.ModelViewSet):
    queryset = GroupResource.objects.all()
    serializer_class = GroupResourceSerializer

class GroupTopicViewSet(viewsets.ModelViewSet):
    queryset = GroupTopic.objects.all()
    serializer_class = GroupTopicSerializer

