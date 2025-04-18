# SPDX-License-Identifier: AGPL-3.0-or-later
"""
API views for event management.
"""

import json
from typing import Any, Dict, List
from uuid import UUID

from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from core.paginator import CustomPagination
from events.models import Event, EventSocialLink, EventText
from events.serializers import (
    EventSerializer,
    EventSocialLinkSerializer,
    EventTextSerializer,
)

# MARK: Event


class EventViewSet(viewsets.ModelViewSet[Event]):
    """
    Viewset for CRUD operations on Event objects.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    pagination_class = CustomPagination

    def list(self, request: Request, *args: str, **kwargs: int) -> Response:
        """
        List all events.

        Parameters
        ----------
        request : Request
            HTTP request object.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments.

        Returns
        -------
        Response
            Response with serialized events.
        """
        serializer = self.get_serializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request, *args: str, **kwargs: int) -> Response:
        """
        Create new event and assign current user as creator.

        Parameters
        ----------
        request : Request
            HTTP request with event data.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments.

        Returns
        -------
        Response
            Response with confirmation message.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        data = {"message": f"New event created: {serializer.data}"}

        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        """
        Retrieve specific event by ID.

        Parameters
        ----------
        request : Request
            HTTP request object.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments containing 'pk' as event ID.

        Returns
        -------
        Response
            Response with event data or error.
        """
        try:
            pk = str(kwargs["pk"])
            event = self.queryset.get(id=pk)
            serializer = self.get_serializer(event)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except event.DoesNotExist:
            return Response({"error": "Event not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, *args: str, **kwargs: int) -> Response:
        """
        Update an event if user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with updated data.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments containing 'pk' as event ID.

        Returns
        -------
        Response
            Response with updated data or error.
        """
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
        """
        Partially update an event if user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request with partial data.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments containing 'pk' as event ID.

        Returns
        -------
        Response
            Response with updated data or error.
        """
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
        """
        Delete an event if user is the creator.

        Parameters
        ----------
        request : Request
            HTTP request object.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments containing 'pk' as event ID.

        Returns
        -------
        Response
            Response with success message or error.
        """
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


# MARK: Bridge Tables


class EventSocialLinkViewSet(viewsets.ModelViewSet[EventSocialLink]):
    """
    Viewset for operations on EventSocialLink objects.
    """

    queryset = EventSocialLink.objects.all()
    serializer_class = EventSocialLinkSerializer

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """
        Update all social links for an event.

        Parameters
        ----------
        request : Request
            HTTP request with social link data.

        *args : tuple
            Variable positional arguments.

        **kwargs : dict
            Variable keyword arguments containing 'pk' as event ID.

        Returns
        -------
        Response
            Response with updated links or error.
        """
        pk = kwargs.get("pk")
        if not isinstance(pk, (str, UUID)):
            return Response(
                {"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST
            )

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
    """
    Viewset for CRUD operations on EventText objects.
    """

    queryset = EventText.objects.all()
    serializer_class = EventTextSerializer
