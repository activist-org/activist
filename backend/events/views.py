# SPDX-License-Identifier: AGPL-3.0-or-later
"""
API views for event management.
"""

import logging
from typing import Any, Sequence, Type
from uuid import UUID

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
from core.permissions import IsAdminStaffCreatorOrReadOnly
from events.models import Event, EventFaq, EventFlag, EventSocialLink, EventText
from events.serializers import (
    EventFaqSerializer,
    EventFlagSerializers,
    EventPOSTSerializer,
    EventSerializer,
    EventSocialLinkSerializer,
    EventTextSerializer,
)

logger = logging.getLogger("django")

# MARK: Event


class EventAPIView(GenericAPIView[Event]):
    queryset = Event.objects.all().order_by("id")
    serializer_class = EventSerializer
    pagination_class = CustomPagination
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

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
            400: OpenApiResponse(response={"detail": "Failed to create event."}),
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
            logger.info(
                f"Event created by user {request.user.id} with location {location.id}"
            )

        except (IntegrityError, OperationalError) as e:
            logger.exception(f"Failed to create event for user {request.user.id}: {e}")
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
            400: OpenApiResponse(response={"detail": "Event ID is required."}),
            404: OpenApiResponse(response={"detail": "Event Not Found."}),
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

        except Event.DoesNotExist as e:
            logger.exception(f"Event with id {id} does not exist for get: {e}")
            return Response(
                {"detail": "Event Not Found."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @extend_schema(
        responses={
            200: EventSerializer,
            400: OpenApiResponse(response={"detail": "Event ID is required."}),
            401: OpenApiResponse(response={"detail": "User not authorized."}),
            404: OpenApiResponse(response={"detail": "Event Not Found."}),
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

        except Event.DoesNotExist as e:
            logger.exception(f"Event with id {id} does not exist for update: {e}")
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

        except Event.DoesNotExist as e:
            logger.exception(f"Event with id {id} does not exist for delete: {e}")
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


class EventFlagAPIView(GenericAPIView[EventFlag]):
    queryset = EventFlag.objects.all()
    serializer_class = EventFlagSerializers
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: EventFlagSerializers(many=True)})
    def get(self, request: Request) -> Response:
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            201: EventFlagSerializers,
            400: OpenApiResponse(response={"detail": "Failed to create flag."}),
        }
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(created_by=request.user)
            logger.info(f"Event flag created by user {request.user.id}")

        except (IntegrityError, OperationalError) as e:
            logger.exception(
                f"Failed to create event flag for user {request.user.id}: {e}"
            )
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventFlagDetailAPIView(GenericAPIView[EventFlag]):
    queryset = EventFlag.objects.all()
    serializer_class = EventFlagSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

    @extend_schema(
        responses={
            200: EventFlagSerializers,
            404: OpenApiResponse(
                response={"detail": "Failed to retrieve the event flag."}
            ),
        }
    )
    def get(self, request: Request, id: UUID | str) -> Response:
        try:
            flag = EventFlag.objects.get(id=id)

        except EventFlag.DoesNotExist as e:
            logger.exception(f"EventFlag with id {id} does not exist for get: {e}")
            return Response(
                {"detail": "Failed to retrieve the flag."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, flag)

        serializer = EventFlagSerializers(flag)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            204: OpenApiResponse(response={"message": "Flag deleted successfully."}),
            401: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            403: OpenApiResponse(
                response={"detail": "You are not authorized to delete this flag."}
            ),
            404: OpenApiResponse(response={"detail": "Failed to retrieve flag."}),
        }
    )
    def delete(self, request: Request, id: UUID | str) -> Response:
        try:
            flag = EventFlag.objects.get(id=id)

        except EventFlag.DoesNotExist as e:
            logger.exception(f"EventFlag with id {id} does not exist for delete: {e}")
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()
        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


# MARK: Bridge Tables


class EventFaqViewSet(viewsets.ModelViewSet[EventFaq]):
    queryset = EventFaq.objects.all()
    serializer_class = EventFaqSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event: Event = serializer.validated_data["event"]

        if request.user != event.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to create FAQs for this event."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"FAQ created for event {event.id} by user {request.user.id}")

        return Response(
            {"message": "FAQ created successfully."}, status=status.HTTP_201_CREATED
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            faq = EventFaq.objects.get(id=pk)

        except EventFaq.DoesNotExist as e:
            logger.exception(f"FAQ with id {pk} does not exist for update: {e}")
            return Response(
                {"error": "FAQ not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != faq.event.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to update this FAQ."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(faq, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "FAQ updated successfully."}, status=status.HTTP_200_OK
        )


class EventSocialLinkViewSet(viewsets.ModelViewSet[EventSocialLink]):
    queryset = EventSocialLink.objects.all()
    serializer_class = EventSocialLinkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event: Event = serializer.validated_data["event"]

        if request.user != event.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to create social links for this event."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"Social link created for event {event.id}")

        return Response(
            {"message": "Social link created successfully."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            social_link = EventSocialLink.objects.get(id=pk)

        except EventSocialLink.DoesNotExist as e:
            logger.exception(f"Social link with id {pk} does not exist for update: {e}")
            return Response(
                {"detail": "Social link not found."}, status=status.HTTP_404_NOT_FOUND
            )

        event = social_link.event

        if event is not None:
            creator = event.created_by

        else:
            raise ValueError("Event is None.")

        if request.user != creator and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to update the social links for this event."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        EventSocialLink.objects.filter(event=event).delete()

        serializer = self.get_serializer(social_link, request.data, partial=True)
        if serializer.is_valid():
            serializer.save(event=event)

            return Response(
                {"message": "Social links updated successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST
        )


class EventTextViewSet(viewsets.ModelViewSet[EventText]):
    queryset = EventText.objects.all()
    serializer_class = EventTextSerializer
