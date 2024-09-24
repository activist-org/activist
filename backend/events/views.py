from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
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
    EventText,
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
    EventTextSerializer,
    EventTopicSerializer,
    FormatSerializer,
    RoleSerializer,
)

# MARK: Main Tables


class EventViewSet(viewsets.ModelViewSet[Event]):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def list(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        data = {"message": f"New event created: {serializer.data}"}

        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        if event := self.queryset.get(id=kwargs["pk"]):
            serializer = self.get_serializer(event)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, *args: str, **kwargs: int) -> Response:
        event = self.queryset.filter(id=kwargs["pk"]).first()
        if event is None:
            return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

        if request.user != event.created_by:
            return Response(
                {"error": "You are not authorized to update this event"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_200_OK)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        event = self.queryset.filter(id=kwargs["pk"]).first()
        if event is None:
            return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

        if request.user != event.created_by:
            return Response(
                {"error": "You are not authorized to update this event"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_200_OK)

    def destroy(self, request: Request, *args: str, **kwargs: int) -> Response:
        event = self.queryset.filter(id=kwargs["pk"]).first()
        if event is None:
            return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

        if request.user != event.created_by:
            return Response(
                {"error": "You are not authorized to delete this event"},
                status.HTTP_401_UNAUTHORIZED,
            )

        event.delete()

        return Response({"message": "Event deleted successfully"}, status.HTTP_200_OK)


class FormatViewSet(viewsets.ModelViewSet[Format]):
    queryset = Format.objects.all()
    serializer_class = FormatSerializer
    pagination_class = CustomPagination


class RoleViewSet(viewsets.ModelViewSet[Role]):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    pagination_class = CustomPagination


# MARK: Bridge Tables


class EventAttendeeViewSet(viewsets.ModelViewSet[EventAttendee]):
    queryset = EventAttendee.objects.all()
    serializer_class = EventAttendeeSerializer
    pagination_class = CustomPagination


class EventAttendeeStatusViewSet(viewsets.ModelViewSet[EventAttendeeStatus]):
    queryset = EventAttendeeStatus.objects.all()
    serializer_class = EventAttendeeStatusSerializer
    pagination_class = CustomPagination


class EventFormatViewSet(viewsets.ModelViewSet[EventFormat]):
    queryset = EventFormat.objects.all()
    serializer_class = EventFormatSerializer
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


class EventTextViewSet(viewsets.ModelViewSet[EventText]):
    queryset = EventText.objects.all()
    serializer_class = EventTextSerializer
    pagination_class = CustomPagination


class EventTopicViewSet(viewsets.ModelViewSet[EventTopic]):
    queryset = EventTopic.objects.all()
    serializer_class = EventTopicSerializer
    pagination_class = CustomPagination
