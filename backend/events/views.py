from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from entities.models import OrganizationMember
from rest_framework.throttling import (
    AnonRateThrottle,
    UserRateThrottle,
)

from backend.paginator import CustomPagination

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTask,
    EventTopic,
    Format,
    Role,
)
from .serializers import (
    EventAttendeeSerializer,
    EventAttendeeStatusSerializer,
    EventFormatSerializer,
    EventResourceSerializer,
    EventRoleSerializer,
    EventSerializer,
    EventTaskSerializer,
    EventTopicSerializer,
    FormatSerializer,
    RoleSerializer,
    
)

class EventViewSet(viewsets.ModelViewSet[Event]):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    
    def list(self, request: Request, *args: str, **kwagrs: int) -> Response:
        queryset = Event.objects.all()
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def create(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(data=request.data)
        member = get_object_or_404(OrganizationMember, user_id=request.data["created_by"])
        if member.is_admin and serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Event, pk=kwargs["pk"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def update(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Event, pk=kwargs["pk"])
        serializer = self.get_serializer(instance, data=request.data)
        member = get_object_or_404(OrganizationMember, user_id=request.data["created_by"])
        if member.is_admin and serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Event, pk=kwargs["pk"])
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        member = get_object_or_404(OrganizationMember, user_id=request.data["created_by"])
        if member.is_admin and serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request: Request, *args: str, **kwargs: int) -> Response:
        instance = get_object_or_404(Event, pk=kwargs["pk"])
        instance.delete()
        return Response(status=status.HTTP_202_ACCEPTED)


class FormatViewSet(viewsets.ModelViewSet[Format]):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer
    pagination_class = CustomPagination


class RoleViewSet(viewsets.ModelViewSet[Role]):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = CustomPagination


class EventAttendeeViewSet(viewsets.ModelViewSet[EventAttendee]):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer
    pagination_class = CustomPagination


class EventFormatViewSet(viewsets.ModelViewSet[EventFormat]):
    queryset = EventFormat.objects.all()
    serializer_class = EventFormatSerializer
    pagination_class = CustomPagination


class EventAttendeeStatusViewSet(viewsets.ModelViewSet[EventAttendeeStatus]):
    queryset = EventAttendeeStatus.objects.all()
    serializer_class = EventAttendeeStatusSerializer
    pagination_class = CustomPagination


class EventResourceViewSet(viewsets.ModelViewSet[EventResource]):
    queryset = EventResource.objects.all()
    serializer_class = EventResourceSerializer
    pagination_class = CustomPagination


class EventRoleViewSet(viewsets.ModelViewSet[EventRole]):
    queryset = EventRole.objects.all()
    serializer_class = EventRoleSerializer
    pagination_class = CustomPagination


class EventTaskViewSet(viewsets.ModelViewSet[EventTask]):
    queryset = EventTask.objects.all()
    serializer_class = EventTaskSerializer
    pagination_class = CustomPagination


class EventTopicViewSet(viewsets.ModelViewSet[EventTopic]):
    queryset = EventTopic.objects.all()
    serializer_class = EventTopicSerializer
    pagination_class = CustomPagination
