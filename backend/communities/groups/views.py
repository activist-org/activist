# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for group management.
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
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.request import Request
from rest_framework.response import Response

from communities.groups.models import (
    Group,
    GroupFaq,
    GroupFlag,
    GroupSocialLink,
    GroupText,
)
from communities.groups.serializers import (
    GroupFaqSerializer,
    GroupFlagSerializer,
    GroupPOSTSerializer,
    GroupSerializer,
    GroupSocialLinkSerializer,
    GroupTextSerializer,
)
from content.models import Location
from core.paginator import CustomPagination

# MARK: Group


class GroupAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all().order_by("id")
    serializer_class = GroupSerializer
    pagination_class = CustomPagination
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_permissions(self) -> Sequence[Any]:
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_class(self) -> Type[GroupSerializer | GroupPOSTSerializer]:
        if self.request.method == "POST":
            return GroupPOSTSerializer

        return GroupSerializer

    @extend_schema(
        responses={200: GroupSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=GroupPOSTSerializer,
        responses={
            201: GroupPOSTSerializer,
            400: OpenApiResponse(response={"error": "Failed to create group."}),
        },
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer: GroupPOSTSerializer | GroupSerializer = serializer_class(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)

        location_dict = serializer.validated_data["location"]
        location = Location.objects.create(**location_dict)

        try:
            serializer.save(created_by=request.user, location=location)

        except (IntegrityError, OperationalError):
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"error": "Failed to create group."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupDetailAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = (TokenAuthentication,)
    permissions_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(
        responses={
            200: GroupSerializer,
            400: OpenApiResponse(response={"error": "Group ID is required"}),
            404: OpenApiResponse(response={"error": "Failed to retrieve the Group"}),
        }
    )
    def get(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Group ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.get(id=id)
            serializer = GroupSerializer(group)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Group.DoesNotExist:
            return Response(
                {"error": "Failed to retrieve the Group"},
                status=status.HTTP_404_NOT_FOUND,
            )

    @extend_schema(
        responses={
            200: GroupSerializer,
            400: OpenApiResponse(response={"error": "Group ID is required"}),
            404: OpenApiResponse(response={"error": "Group not found"}),
        }
    )
    def put(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Group ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.get(id=id)

        except Group.DoesNotExist:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this group"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.serializer_class(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(response={"message": "Group deleted successfully."}),
            400: OpenApiResponse(response={"error": "Group ID is required"}),
            401: OpenApiResponse(
                response={"error": "You are not authorized to delete this group"}
            ),
            404: OpenApiResponse(response={"error": "Group not found"}),
        }
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Group ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.select_related("created_by").get(id=id)

        except Group.DoesNotExist:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to delete this group"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response({"message": "Group deleted successfully."}, status.HTTP_200_OK)


class GroupFlagViewSet(viewsets.ModelViewSet[GroupFlag]):
    queryset = GroupFlag.objects.all()
    serializer_class = GroupFlagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = CustomPagination
    http_method_names = ["get", "post", "delete"]

    def create(self, request: Request):
        if request.user.is_authenticated:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(
            {"error": "You are not allowed to flag this group."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    def list(self, request: Request):
        query = self.queryset.filter()
        serializer = self.get_serializer(query, many=True)

        return self.get_paginated_response(self.paginate_queryset(serializer.data))

    def retrieve(self, request: Request, pk: str | None):
        if pk is not None:
            query = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(query)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request: Request):
        item = self.get_object()
        if request.user.is_staff:
            self.perform_destroy(item)
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(
                {"error": "You are not authorized to delete this flag."},
                status=status.HTTP_403_FORBIDDEN,
            )


# MARK: Bridge Tables


class GroupSocialLinkViewSet(viewsets.ModelViewSet[GroupSocialLink]):
    queryset = GroupSocialLink.objects.all()
    serializer_class = GroupSocialLinkSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        group = Group.objects.filter(id=pk).first()
        if not group:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                # Delete all existing social links for this group.
                GroupSocialLink.objects.filter(group=group).delete()

                # Create new social links from the submitted data.
                social_links: List[Dict[str, str]] = []
                for link_data in data:
                    if isinstance(link_data, dict):
                        social_link = GroupSocialLink.objects.create(
                            group=group,
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


class GroupFaqViewSet(viewsets.ModelViewSet[GroupFaq]):
    queryset = GroupFaq.objects.all()
    serializer_class = GroupFaqSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        group = Group.objects.filter(id=pk).first()
        if not group:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                faq = GroupFaq.objects.filter(id=data.get("id")).first()
                if not faq:
                    return Response(
                        {"error": "FAQ not found"}, status=status.HTTP_404_NOT_FOUND
                    )
                faq.question = data.get("question", faq.question)
                faq.answer = data.get("answer", faq.answer)
                faq.save()

            return Response(
                {"message": "FAQ updated successfully."}, status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": f"Failed to update faqs: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GroupTextViewSet(viewsets.ModelViewSet[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
