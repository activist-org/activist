# SPDX-License-Identifier: AGPL-3.0-or-later
import json
from typing import Dict, List
from uuid import UUID

from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from core.paginator import CustomPagination
from core.settings import (
    CACHE_DURATION,
    EVENT_LIST_CACHE_PREFIX,
    EVENT_RETRIEVE_CACHE_PREFIX,
)
from events.models import Event, EventSocialLink, EventText
from events.serializers import (
    EventSerializer,
    EventSocialLinkSerializer,
    EventTextSerializer,
)

# MARK: Main Tables


class EventViewSet(viewsets.ModelViewSet[Event]):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=EVENT_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        data = {"message": f"New event created: {serializer.data}"}

        return Response(data, status=status.HTTP_201_CREATED)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=EVENT_RETRIEVE_CACHE_PREFIX)
    )
    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        try:
            pk = str(kwargs["pk"])
            event = self.queryset.get(id=pk)
            serializer = self.get_serializer(event)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except event.DoesNotExist:
            return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, *args: str, **kwargs: int) -> Response:
        try:
            pk = str(kwargs["pk"])
            event = self.queryset.filter(id=pk).first()
            if event is None:
                return Response(
                    {"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND
                )

            if request.user != event.created_by:
                return Response(
                    {"error": "You are not authorized to update this event"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            serializer = self.get_serializer(event, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        except (Event.DoesNotExist, ValueError):
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        try:
            pk = str(kwargs["pk"])
            event = self.queryset.filter(id=pk).first()

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

        except (Event.DoesNotExist, ValueError):
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request: Request, *args: str, **kwargs: int) -> Response:
        try:
            pk = str(kwargs["pk"])
            event = self.queryset.filter(id=pk).first()

            if event is None:
                return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

            if request.user != event.created_by:
                return Response(
                    {"error": "You are not authorized to delete this event"},
                    status.HTTP_401_UNAUTHORIZED,
                )

            event.delete()
            return Response(
                {"message": "Event deleted successfully."}, status.HTTP_200_OK
            )

        except (Event.DoesNotExist, ValueError):
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )


class EventSocialLinkViewSet(viewsets.ModelViewSet[EventSocialLink]):
    queryset = EventSocialLink.objects.all()
    serializer_class = EventSocialLinkSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        event = Event.objects.filter(id=pk).first()
        if not event:
            return Response(
                {"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                # Delete all existing social links for this event.
                EventSocialLink.objects.filter(event=event).delete()

                # Create new social links from the submitted data.
                social_links: List[Dict[str, str]] = []
                for link_data in data:
                    if isinstance(link_data, dict):
                        social_link = EventSocialLink.objects.create(
                            event=event,
                            order=link_data.get("order"),
                            link=link_data.get("link"),
                            label=link_data.get("label"),
                        )
                        social_links.append(social_link)

            serializer = self.get_serializer(social_links, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Failed to update social links: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class EventTextViewSet(viewsets.ModelViewSet[EventText]):
    queryset = EventText.objects.all()
    serializer_class = EventTextSerializer
