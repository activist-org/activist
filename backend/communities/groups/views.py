# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for group management.
"""

import logging
from typing import List, Type
from uuid import UUID

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

logger = logging.getLogger("django")

# MARK: Group


class GroupAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all().order_by("id")
    serializer_class = GroupSerializer
    pagination_class = CustomPagination
    authentication_classes = [TokenAuthentication]
    permission_classes: List[Type[BasePermission]] = [IsAuthenticatedOrReadOnly]

    def get_permissions(self) -> List[BasePermission]:
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method in SAFE_METHODS:
            self.permission_classes = [IsAuthenticatedOrReadOnly]

        else:
            self.permission_classes = [IsAuthenticated]

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
            logger.info(
                f"Group created by user {request.user} with location {location.id}"
            )

        except (IntegrityError, OperationalError) as e:
            logger.exception(f"Failed to create group for user {request.user}: {e}")
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"detail": "Failed to create group."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupDetailAPIView(GenericAPIView[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

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

        except Group.DoesNotExist as e:
            logger.exception(f"Failed to retrieve group with id {id}: {e}")
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

        except Group.DoesNotExist as e:
            logger.exception(f"Group not found for update with id {id}: {e}")
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

        except Group.DoesNotExist as e:
            logger.exception(f"Group not found for delete with id {id}: {e}")
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
    permission_classes = [IsAuthenticated]

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

        except (IntegrityError, OperationalError) as e:
            logger.exception(f"Failed to create flag for user {request.user}: {e}")
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GroupFlagDetailAPIView(GenericAPIView[GroupFlag]):
    queryset = GroupFlag.objects.all()
    serializer_class = GroupFlagSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

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

        except GroupFlag.DoesNotExist as e:
            logger.exception(f"Failed to retrieve flag with id {id}: {e}")
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

        except GroupFlag.DoesNotExist as e:
            logger.exception(f"Flag not found for delete with id {id}: {e}")
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()

        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


# MARK: Bridge Tables


class GroupFaqViewSet(viewsets.ModelViewSet[GroupFaq]):
    queryset = GroupFaq.objects.all()
    serializer_class = GroupFaqSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group: Group = serializer.validated_data["group"]

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to create FAQs for this group."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"FAQ created for group {group.id} by user {request.user}")

        return Response(
            {"message": "FAQ created successfully."}, status=status.HTTP_201_CREATED
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            faq = GroupFaq.objects.get(id=pk)

        except GroupFaq.DoesNotExist as e:
            logger.exception(f"FAQ not found for update with id {pk}: {e}")
            return Response(
                {"error": "FAQ not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != faq.group.created_by and not request.user.is_staff:
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


class GroupSocialLinkViewSet(GenericAPIView[GroupSocialLink]):
    queryset = GroupSocialLink.objects.all()
    serializer_class = GroupSocialLinkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        responses={
            200: {"message": "Group social links updated successfully."},
            403: {
                "detail": "You are not authorized to update this groups social links."
            },
            404: {"detail": "Social links not found."},
        }
    )
    def put(self, request: Request, id: UUID | str) -> Response:
        try:
            social_links = GroupSocialLink.objects.get(id=id)
        except GroupSocialLink.DoesNotExist:
            return Response(
                {"detail": "Social links not found."}, status=status.HTTP_404_NOT_FOUND
            )

        group = social_links.group

        if group is not None:
            creator = group.created_by
        else:
            raise ValueError("Group is None.")

        if request.user != creator and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to update the social links for this group."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        GroupSocialLink.objects.filter(group=group).delete()

        serializer = self.get_serializer(social_links, request.data, partial=True)
        if serializer.is_valid():
            serializer.save(group=group)
          
            return Response(
                {"message": "Social links updated successfully."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST
        )


class GroupTextViewSet(viewsets.ModelViewSet[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
