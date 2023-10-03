from rest_framework import viewsets
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


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination


class FormatViewSet(viewsets.ModelViewSet):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer
    pagination_class = CustomPagination


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = CustomPagination


class EventAttendeeViewSet(viewsets.ModelViewSet):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer
    pagination_class = CustomPagination


class EventFormatViewSet(viewsets.ModelViewSet):
    queryset = EventFormat.objects.all()
    serializer_class = EventFormatSerializer
    pagination_class = CustomPagination


class EventAttendeeStatusViewSet(viewsets.ModelViewSet):
    queryset = EventAttendeeStatus.objects.all()
    serializer_class = EventAttendeeStatusSerializer
    pagination_class = CustomPagination


class EventResourceViewSet(viewsets.ModelViewSet):
    queryset = EventResource.objects.all()
    serializer_class = EventResourceSerializer
    pagination_class = CustomPagination


class EventRoleViewSet(viewsets.ModelViewSet):
    queryset = EventRole.objects.all()
    serializer_class = EventRoleSerializer
    pagination_class = CustomPagination


class EventTaskViewSet(viewsets.ModelViewSet):
    queryset = EventTask.objects.all()
    serializer_class = EventTaskSerializer
    pagination_class = CustomPagination


class EventTopicViewSet(viewsets.ModelViewSet):
    queryset = EventTopic.objects.all()
    serializer_class = EventTopicSerializer
    pagination_class = CustomPagination
