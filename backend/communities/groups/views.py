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
    GroupImage,
    GroupResource,
    GroupSocialLink,
    GroupText,
)
from communities.groups.serializers import (
    GroupFaqSerializer,
    GroupFlagSerializer,
    GroupPOSTSerializer,
    GroupResourceSerializer,
    GroupSerializer,
    GroupSocialLinkSerializer,
    GroupTextSerializer,
)
from content.models import Image, Location
from content.serializers import ImageSerializer
from core.paginator import CustomPagination
from core.permissions import IsAdminStaffCreatorOrReadOnly

logger = logging.getLogger("django")

# MARK: API


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


# MARK: Detail API


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


# MARK: Flag


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


# MARK: Flag Detail


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


# MARK: FAQ


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


# MARK: Social Link


class GroupSocialLinkViewSet(viewsets.ModelViewSet[GroupSocialLink]):
    queryset = GroupSocialLink.objects.all()
    serializer_class = GroupSocialLinkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def delete(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group: Group = serializer.validated_data["group"]

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to delete social links for this group."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        GroupSocialLink.objects.filter(group=group).delete()
        logger.info(f"Social links deleted for group {group.id}")

        return Response(
            {"message": "Social links deleted successfully."},
            status=status.HTTP_201_CREATED,
        )

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group: Group = serializer.validated_data["group"]

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to create social links for this group."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"Social link created for group {group.id}")

        return Response(
            {"message": "Social link created successfully."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            social_links = GroupSocialLink.objects.get(id=pk)

        except GroupSocialLink.DoesNotExist as e:
            logger.exception(f"Social link with id {pk} does not exist for update: {e}")
            return Response(
                {"detail": "Social link not found."}, status=status.HTTP_404_NOT_FOUND
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

        serializer = self.get_serializer(social_links, request.data, partial=True)
        if serializer.is_valid():
            serializer.save(group=group)

            return Response(
                {"message": "Social link updated successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST
        )


class GroupResourceViewSet(viewsets.ModelViewSet[GroupResource]):
    queryset = GroupResource.objects.all()
    serializer_class = GroupResourceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        group: Group = serializer.validated_data["group"]

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to create resource for this organization."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save(created_by=request.user)
        logger.info(f"Resource created for group {group.id} by user {request.user.id}")

        return Response(
            {"message": "Resource created successfully."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            resource = GroupResource.objects.get(id=pk)

        except GroupResource.DoesNotExist as e:
            logger.exception(f"Resource with id {pk} does not exist for update: {e}")
            return Response(
                {"error": "Resource not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != resource.group.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to update this FAQ."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(resource, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"message": "Resource updated successfully."}, status=status.HTTP_200_OK
        )


# MARK: Text


class GroupTextViewSet(GenericAPIView[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

    @extend_schema(
        responses={
            200: GroupTextSerializer,
            403: OpenApiResponse(
                response={
                    "detail": "You are not authorized to update this group's texts."
                }
            ),
            404: OpenApiResponse(response={"detail": "Group text not found."}),
        }
    )
    def put(self, request: Request, id: UUID | str) -> Response:
        try:
            group_text = self.queryset.get(id=id)

        except GroupText.DoesNotExist as e:
            logger.exception(f"Group text not found for update with id {id}: {e}")
            return Response(
                {"detail": "Group text not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if (
            request.user != getattr(group_text.group, "created_by", None)
            and not request.user.is_staff
        ):
            return Response(
                {"detail": "You are not authorized to update to this group's text."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.serializer_class(group_text, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


# MARK: Image


class GroupImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def list(self, request: Request, group_id: UUID) -> Response:
        images = Image.objects.filter(groupimage__group_id=group_id).order_by(
            "groupimage__sequence_index"
        )
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)

    def update(self, request: Request, group_id: UUID, pk: UUID | str) -> Response:
        sequence_index = request.data.get("sequence_index", None)
        if sequence_index is not None:
            # Update GroupImage, not the Image itself.
            try:
                group_image = GroupImage.objects.get(group_id=group_id, image_id=pk)
                group_image.sequence_index = sequence_index
                group_image.save()
                return Response(
                    {"detail": "Sequence index updated."}, status=status.HTTP_200_OK
                )

            except GroupImage.DoesNotExist:
                return Response(
                    {"detail": "GroupImage relation not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Fallback to default image update if needed.
        return super().update(request)
