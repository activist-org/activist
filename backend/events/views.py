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


class EventViewSet(viewsets.ModelViewSet[Event]):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class FormatViewSet(viewsets.ModelViewSet[Format]):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer


class RoleViewSet(viewsets.ModelViewSet[Role]):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class EventAttendeeViewSet(viewsets.ModelViewSet[EventAttendee]):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer


class EventFormatViewSet(viewsets.ModelViewSet[EventFormat]):
    queryset = EventFormat.objects.all()
    serializer_class = EventFormatSerializer


class EventAttendeeStatusViewSet(viewsets.ModelViewSet[EventAttendeeStatus]):
    queryset = EventAttendeeStatus.objects.all()
    serializer_class = EventAttendeeStatusSerializer


class EventResourceViewSet(viewsets.ModelViewSet[EventResource]):
    queryset = EventResource.objects.all()
    serializer_class = EventResourceSerializer


class EventRoleViewSet(viewsets.ModelViewSet[EventRole]):
    queryset = EventRole.objects.all()
    serializer_class = EventRoleSerializer


class EventTaskViewSet(viewsets.ModelViewSet[EventTask]):
    queryset = EventTask.objects.all()
    serializer_class = EventTaskSerializer


class EventTopicViewSet(viewsets.ModelViewSet[EventTopic]):
    queryset = EventTopic.objects.all()
    serializer_class = EventTopicSerializer
