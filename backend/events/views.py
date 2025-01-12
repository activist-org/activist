# SPDX-License-Identifier: AGPL-3.0-or-later
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from core.paginator import CustomPagination

from .models import Event
from .serializers import EventSerializer

# MARK: Main Tables


class EventViewSet(viewsets.ModelViewSet[Event]):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination

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

        return Response({"message": "Event deleted successfully."}, status.HTTP_200_OK)
