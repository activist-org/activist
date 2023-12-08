from rest_framework import viewsets
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
