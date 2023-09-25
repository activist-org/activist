from rest_framework import viewsets

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


class FormatViewSet(viewsets.ModelViewSet):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class EventAttendeeViewSet(viewsets.ModelViewSet):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer


class EventFormatViewSet(viewsets.ModelViewSet):
    queryset = EventFormat.objects.all()
    serializer_class = EventFormatSerializer


class EventAttendeeStatusViewSet(viewsets.ModelViewSet):
    queryset = EventAttendeeStatus.objects.all()
    serializer_class = EventAttendeeStatusSerializer


class EventResourceViewSet(viewsets.ModelViewSet):
    queryset = EventResource.objects.all()
    serializer_class = EventResourceSerializer


class EventRoleViewSet(viewsets.ModelViewSet):
    queryset = EventRole.objects.all()
    serializer_class = EventRoleSerializer


class EventTaskViewSet(viewsets.ModelViewSet):
    queryset = EventTask.objects.all()
    serializer_class = EventTaskSerializer


class EventTopicViewSet(viewsets.ModelViewSet):
    queryset = EventTopic.objects.all()
    serializer_class = EventTopicSerializer
