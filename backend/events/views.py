# SPDX-License-Identifier: AGPL-3.0-or-later
"""
API views for event management.
"""

import json
from typing import Any, Dict, List, Sequence, Type
from uuid import UUID

from django.db import transaction
from django.db.utils import IntegrityError, OperationalError
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from content.models import Location
from core.paginator import CustomPagination
from events.models import Event, EventFaq, EventFlag, EventSocialLink, EventText
from events.serializers import (
    EventFaqSerializer,
    EventFlagSerializers,
    EventPOSTSerializer,
    EventSerializer,
    EventSocialLinkSerializer,
    EventTextSerializer,
)

# MARK: Event


class EventAPIView(GenericAPIView[Event]):
    queryset = Event.objects.all().order_by("id")
    serializer_class = EventSerializer
    pagination_class = CustomPagination
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_permissions(self) -> Sequence[Any]:
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self) -> Type[EventPOSTSerializer | EventSerializer]:
        if self.request.method == "POST":
            return EventPOSTSerializer

        return EventSerializer

    @extend_schema(responses={200: EventSerializer(many=True)})
    def get(self, request: Request) -> Response:
        page = self.paginate_queryset(self.queryset)

        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(self.queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=EventPOSTSerializer,
        responses={
            201: EventPOSTSerializer,
            400: OpenApiResponse(response={"error": "Failed to create event."}),
        },
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer: EventPOSTSerializer | EventSerializer = serializer_class(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        location_data = serializer.validated_data["offline_location"]
        location = Location.objects.create(**location_data)

        try:
            serializer.save(created_by=request.user, offline_location=location)

        except (IntegrityError, OperationalError):
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"detail": "Failed to create event."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventDetailAPIView(APIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @extend_schema(
        responses={
            200: EventSerializer,
            400: OpenApiResponse(response={"error": "Event ID is required."}),
            404: OpenApiResponse(response={"error": "Event Not Found."}),
        }
    )
    def get(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Event ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event = self.queryset.get(id=id)
            serializer = self.serializer_class(event)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Event.DoesNotExist:
            return Response(
                {"detail": "Event Not Found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @extend_schema(
        responses={
            200: EventSerializer,
            400: OpenApiResponse(response={"error": "Event ID is required."}),
            401: OpenApiResponse(response={"error": "User not authorized."}),
            404: OpenApiResponse(response={"error": "Event Not Found."}),
        }
    )
    def put(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Event ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event = self.queryset.get(id=id)

        except Event.DoesNotExist:
            return Response(
                {"detail": "Event Not Found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user != event.created_by:
            return Response(
                {"detail": "User not authorized."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.serializer_class(event, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(response={"message": "Event deleted successfully."}),
            400: OpenApiResponse(response={"detail": "Event ID is required."}),
            401: OpenApiResponse(response={"detail": "User not authorized."}),
            404: OpenApiResponse(response={"detail": "Event Not Found."}),
        }
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Event ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            event = self.queryset.get(id=id)

        except Event.DoesNotExist:
            return Response(
                {"detail": "Event Not Found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != event.created_by:
            return Response(
                {"detail": "User not authorized."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        event.delete()
        return Response(
            {"message": "Event deleted successfully."}, status=status.HTTP_200_OK
        )


# MARK: Event Flag


class EventFlagViewSet(viewsets.ModelViewSet[EventFlag]):
    queryset = EventFlag.objects.all()
    serializer_class = EventFlagSerializers
    pagination_class = CustomPagination
    http_method_names = ["get", "post", "delete"]

    def create(self, request: Request) -> Response:
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response(
                {"detail": "You are not allowed to flag this event."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

    def list(self, request: Request) -> Response:
        query = self.queryset.filter()
        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def retrieve(self, request: Request, pk: str | None) -> Response:
        if pk is not None:
            query = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"detail": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(query)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request) -> Response:
        query = self.get_object()
        if request.user.is_staff:
            self.perform_destroy(query)

            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(
                {"detail": "You are not authorized to delete this event flag."},
                status=status.HTTP_403_FORBIDDEN,
            )


# MARK: Bridge Tables


class EventSocialLinkViewSet(viewsets.ModelViewSet[EventSocialLink]):
    queryset = EventSocialLink.objects.all()
    serializer_class = EventSocialLinkSerializer

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        pk = kwargs.get("pk")
        if not isinstance(pk, (str, UUID)):
            return Response(
                {"detail": "Invalid ID format."}, status=status.HTTP_400_BAD_REQUEST
            )

        event = Event.objects.filter(id=pk).first()
        if not event:
            return Response(
                {"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND
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
                {"detail": f"Failed to update social links: {str(e)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class EventFaqViewSet(viewsets.ModelViewSet[EventFaq]):
    queryset = EventFaq.objects.all()
    serializer_class = EventFaqSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        event = Event.objects.filter(id=pk).first()
        if not event:
            return Response(
                {"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                faq = EventFaq.objects.filter(id=data.get("id")).first()
                if not faq:
                    return Response(
                        {"detail": "FAQ not found."}, status=status.HTTP_404_NOT_FOUND
                    )
                faq.question = data.get("question", faq.question)
                faq.answer = data.get("answer", faq.answer)
                faq.save()

            return Response(
                {"message": "FAQ updated successfully."}, status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"detail": f"Failed to update faqs: {str(e)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class EventTextViewSet(viewsets.ModelViewSet[EventText]):
    queryset = EventText.objects.all()
    serializer_class = EventTextSerializer
