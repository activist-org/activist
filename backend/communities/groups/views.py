# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for group management.
"""

import json
from typing import List, Tuple, Type, cast
from uuid import UUID

from django.db import transaction
from django.db.utils import IntegrityError, OperationalError
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import (
    SAFE_METHODS,
    BasePermission,
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
from core.permissions import IsAdminStaffCreatorOrReadOnly

# MARK: Group


class GroupAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all().order_by("id")
    serializer_class = GroupSerializer
    pagination_class = CustomPagination
    authentication_classes = (TokenAuthentication,)
    permission_classes: Tuple[Type[BasePermission], ...] = (IsAuthenticatedOrReadOnly,)

    def get_permissions(self) -> List[BasePermission]:
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method in SAFE_METHODS:
            self.permission_classes = (IsAuthenticatedOrReadOnly,)

        else:
            self.permission_classes = (IsAuthenticated,)

        return super().get_permissions()  # type: ignore

    def get_serializer_class(self) -> Type[GroupSerializer | GroupPOSTSerializer]:
        if self.request.method in SAFE_METHODS:
            return GroupSerializer

        return GroupPOSTSerializer

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
            400: OpenApiResponse(response={"detail": "Failed to create group."}),
        },
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        location_dict = serializer.validated_data["location"]
        location = Location.objects.create(**location_dict)

        try:
            serializer.save(created_by=request.user, location=location)

        except (IntegrityError, OperationalError):
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"detail": "Failed to create group."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupDetailAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAdminStaffCreatorOrReadOnly,)

    @extend_schema(
        responses={
            200: GroupSerializer,
            400: OpenApiResponse(response={"detail": "Group ID is required"}),
            404: OpenApiResponse(response={"detail": "Failed to retrieve the group."}),
        }
    )
    def get(self, request: Request, id: str | UUID) -> Response:
        try:
            group = Group.objects.get(id=id)

        except Group.DoesNotExist:
            return Response(
                {"detail": "Failed to retrieve the group."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, group)

        serializer = GroupSerializer(group)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: GroupSerializer,
            400: OpenApiResponse(response={"detail": "Group ID is required."}),
            401: OpenApiResponse(
                response={"detail": "You are not authorized to update this group."}
            ),
            403: OpenApiResponse(
                response={"detail": "You are not authorized to perform this action."}
            ),
            404: OpenApiResponse(response={"detail": "Group not found."}),
        }
    )
    def put(self, request: Request, id: str | UUID) -> Response:
        if id is None:
            return Response(
                {"detail": "Group ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.get(id=id)

        except Group.DoesNotExist:
            return Response(
                {"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, group)

        serializer = self.serializer_class(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(response={"message": "Group deleted successfully."}),
            400: OpenApiResponse(response={"detail": "Group ID is required."}),
            401: OpenApiResponse(
                response={"detail": "You are not authorized to delete this group."}
            ),
            403: OpenApiResponse(
                response={"detail": "You are not authorized to perform this action."}
            ),
            404: OpenApiResponse(response={"detail": "Group not found."}),
        }
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Group ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = Group.objects.select_related("created_by").get(id=id)

        except Group.DoesNotExist:
            return Response(
                {"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, group)

        group.delete()

        return Response(
            {"message": "Group deleted successfully."}, status=status.HTTP_200_OK
        )


# MARK: Group Flags


class GroupFlagAPIView(GenericAPIView[GroupFlag]):
    queryset = GroupFlag.objects.all()
    serializer_class = GroupFlagSerializer
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        responses={200: GroupFlagSerializer(many=True)},
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
        responses={
            201: GroupFlagSerializer,
            400: OpenApiResponse(response={"detail": "Failed to create flag."}),
        }
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(created_by=request.user)

        except (IntegrityError, OperationalError):
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupFlagDetailAPIView(GenericAPIView[GroupFlag]):
    queryset = GroupFlag.objects.all()
    serializer_class = GroupFlagSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAdminStaffCreatorOrReadOnly,)

    @extend_schema(
        responses={
            200: GroupFlagSerializer,
            404: OpenApiResponse(
                response={"detail": "Failed to retrieve the group flag."}
            ),
        }
    )
    def get(self, request: Request, id: str | UUID) -> Response:
        try:
            flag = GroupFlag.objects.get(id=id)

        except GroupFlag.DoesNotExist:
            return Response(
                {"detail": "Failed to retrieve the flag."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, flag)

        serializer = GroupFlagSerializer(flag)
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
            404: OpenApiResponse(response={"detail": "Flag not found."}),
        }
    )
    def delete(self, request: Request, id: str | UUID) -> Response:
        try:
            flag = GroupFlag.objects.get(id=id)

        except GroupFlag.DoesNotExist:
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()

        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


# MARK: Bridge Tables


class GroupSocialLinkViewSet(viewsets.ModelViewSet[GroupSocialLink]):
    queryset = GroupSocialLink.objects.all()
    serializer_class = GroupSocialLinkSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        group = Group.objects.filter(id=pk).first()
        if not group:
            return Response(
                {"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            try:
                data = json.loads(data)

            except json.JSONDecodeError:
                return Response(
                    {"detail": "Invalid JSON format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if not isinstance(data, list):
            return Response(
                {"detail": "Expected a list of social links."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                GroupSocialLink.objects.filter(group=group).delete()

                social_links: List[GroupSocialLink] = []
                for link_data in data:
                    if isinstance(link_data, dict):
                        if any(k not in link_data for k in ("link", "label")):
                            raise ValueError(
                                "Each social link must have 'link' and 'label'."
                            )

                        social_link = GroupSocialLink.objects.create(
                            group=group,
                            order=link_data.get("order"),
                            link=link_data.get("link"),
                            label=link_data.get("label"),
                        )
                        social_links.append(social_link)
                    else:
                        raise ValueError(
                            "Each item in the social links list must be a dictionary."
                        )

            serializer = self.get_serializer(social_links, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValueError as ve:
            return Response(
                {"detail": f"Invalid data for social links: {str(ve)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"detail": f"Failed to update social links: {str(e)}."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GroupFaqViewSet(viewsets.ModelViewSet[GroupFaq]):
    queryset = GroupFaq.objects.all()
    serializer_class = GroupFaqSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        group = Group.objects.filter(id=pk).first()
        if not group:
            return Response(
                {"detail": "Group not found."}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                faq_id = cast(UUID | str, data.get("id"))
                faq = GroupFaq.objects.filter(id=faq_id).first()
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


class GroupTextViewSet(viewsets.ModelViewSet[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
