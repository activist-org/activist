# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for organization management.
"""

import logging
from uuid import UUID

from django.db.utils import IntegrityError, OperationalError
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiResponse,
    extend_schema,
)
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from communities.models import StatusType
from communities.organizations.models import (
    Organization,
    OrganizationFaq,
    OrganizationFlag,
    OrganizationSocialLink,
    OrganizationText,
)
from communities.organizations.serializers import (
    OrganizationFaqSerializer,
    OrganizationFlagSerializer,
    OrganizationSerializer,
    OrganizationSocialLinkSerializer,
    OrganizationTextSerializer,
)
from content.models import Image, Location
from content.serializers import ImageSerializer
from core.paginator import CustomPagination
from core.permissions import IsAdminStaffCreatorOrReadOnly

logger = logging.getLogger(__name__)

# MARK: API


class OrganizationAPIView(GenericAPIView[Organization]):
    queryset = Organization.objects.all().order_by("id")
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    @extend_schema(
        responses={200: OrganizationSerializer(many=True)},
    )
    def get(self, request: Request) -> Response:
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Create a new organization",
        request=OrganizationSerializer,
        responses={
            201: OrganizationSerializer,
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Failed to create an organization",
                examples=[
                    OpenApiExample(
                        name="Failed to create organization",
                        value={"error": "Failed to create organization"},
                        media_type="application/json",
                    )
                ],
            ),
        },
    )
    def post(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        location_dict = serializer.validated_data["location"]
        location = Location.objects.create(**location_dict)
        serializer.validated_data["location"] = location

        # Location post-cleanup if the organization creation fails.
        # This is necessary because of a not null constraint on the location field.
        try:
            org = serializer.save(created_by=request.user)
            logger.info(f"Organization created successfully: {org.id}")

        except (IntegrityError, OperationalError):
            logger.exception(
                f"Failed to create organization for user {request.user.id}"
            )
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"detail": "Failed to create organization."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        org.application.create()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# MARK: Detail API


class OrganizationDetailAPIView(APIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    @extend_schema(
        summary="Retrieve a single organization by ID",
        responses={
            200: OrganizationSerializer,
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization ID is required",
                examples=[
                    OpenApiExample(
                        name="Organization ID required",
                        value={"detail": "Organization ID is required."},
                        media_type="application/json",
                    )
                ],
            ),
            404: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Failed to retrieve the organization",
                examples=[
                    OpenApiExample(
                        name="Organization not found",
                        value={"detail": "Failed to retrieve the organization."},
                        media_type="application/json",
                    )
                ],
            ),
        },
    )
    def get(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Organization ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.get(id=id)
            serializer = OrganizationSerializer(org)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            logger.exception(f"Organization with id {id} does not exist.")
            return Response(
                {"detail": "Failed to retrieve the organization."},
                status=status.HTTP_404_NOT_FOUND,
            )

    @extend_schema(
        responses={
            200: OrganizationSerializer,
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization ID is required",
                examples=[
                    OpenApiExample(
                        name="Organization ID required",
                        value={"detail": "Organization ID is required."},
                        media_type="application/json",
                    )
                ],
            ),
            404: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization not found",
                examples=[
                    OpenApiExample(
                        name="Organization not found",
                        value={"detail": "Organization not found."},
                        media_type="application/json",
                    )
                ],
            ),
        }
    )
    def put(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Organization ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.get(id=id)

        except Organization.DoesNotExist:
            logger.exception(f"Organization with id {id} does not exist for update.")
            return Response(
                {"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to update this organization."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.serializer_class(org, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Delete an organization by ID",
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization deleted successfully",
                examples=[
                    OpenApiExample(
                        name="Organization deleted",
                        value={"message": "Organization deleted successfully."},
                        media_type="application/json",
                    )
                ],
            ),
            400: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization ID is required",
                examples=[
                    OpenApiExample(
                        name="Organization ID required",
                        value={"detail": "Organization ID is required."},
                        media_type="application/json",
                    )
                ],
            ),
            401: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="You are not authorized to delete this organization",
                examples=[
                    OpenApiExample(
                        name="Unauthorized",
                        value={
                            "detail": "You are not authorized to delete this organization."
                        },
                        media_type="application/json",
                    )
                ],
            ),
            404: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="Organization not found",
                examples=[
                    OpenApiExample(
                        name="Organization not found",
                        value={"detail": "Organization not found."},
                        media_type="application/json",
                    )
                ],
            ),
        },
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"detail": "Organization ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.select_related("created_by").get(id=id)

        except Organization.DoesNotExist:
            logger.exception(f"Organization with id {id} does not exist for delete.")
            return Response(
                {"detail": "Organization not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to delete this organization."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        org.status = StatusType.objects.get(id=3)  # 3 is the id of the deleted status
        org.deletion_date = timezone.now()
        org.is_high_risk = False
        org.status_updated = None
        org.tagline = ""
        org.save()
        logger.info(f"Organization deleted (soft): {org.id}")

        return Response(
            {"message": "Organization deleted successfully."}, status.HTTP_200_OK
        )


# MARK: Flag


class OrganizationFlagAPIView(GenericAPIView[OrganizationFlag]):
    queryset = OrganizationFlag.objects.all()
    serializer_class = OrganizationFlagSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OrganizationFlagSerializer(many=True)})
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
            201: OrganizationFlagSerializer,
            400: OpenApiResponse(response={"detail": "Failed to create flag."}),
        }
    )
    def post(self, request: Request) -> Response:
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save(created_by=request.user)
            logger.info(f"OrganizationFlag created by user {request.user.id}")

        except (IntegrityError, OperationalError):
            logger.exception(f"Failed to create flag for user {request.user.id}")
            return Response(
                {"detail": "Failed to create flag."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


# MARK: Flag Detail


class OrganizationFlagDetailAPIView(GenericAPIView[OrganizationFlag]):
    queryset = OrganizationFlag.objects.all()
    serializer_class = OrganizationFlagSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

    @extend_schema(
        responses={
            200: OrganizationFlagSerializer,
            404: OpenApiResponse(
                response={"detail": "Failed to retrieve the organization flag."}
            ),
        }
    )
    def get(self, request: Request, id: str | UUID) -> Response:
        try:
            flag = OrganizationFlag.objects.get(id=id)

        except OrganizationFlag.DoesNotExist:
            logger.exception(f"OrganizationFlag with id {id} does not exist.")
            return Response(
                {"detail": "Failed to retrieve the flag."},
                status=status.HTTP_404_NOT_FOUND,
            )

        self.check_object_permissions(request, flag)

        serializer = OrganizationFlagSerializer(flag)
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
    def delete(self, request: Request, id: str | UUID) -> Response:
        try:
            flag = OrganizationFlag.objects.get(id=id)

        except OrganizationFlag.DoesNotExist:
            logger.exception(f"OrganizationFlag with id {id} does not exist.")
            return Response(
                {"detail": "Flag not found."}, status=status.HTTP_404_NOT_FOUND
            )

        self.check_object_permissions(request, flag)

        flag.delete()
        logger.info(f"OrganizationFlag deleted: {id}")
        return Response(
            {"message": "Flag deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


# MARK: FAQ


class OrganizationFaqViewSet(viewsets.ModelViewSet[OrganizationFaq]):
    queryset = OrganizationFaq.objects.all()
    serializer_class = OrganizationFaqSerializer
    permission_classes = [IsAdminStaffCreatorOrReadOnly]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        org: Organization = serializer.validated_data["org"]

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to create FAQs for this organization."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"FAQ created for org {org.id}")

        return Response(
            {"message": "FAQ created successfully."}, status=status.HTTP_201_CREATED
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            faq = OrganizationFaq.objects.get(id=pk)

        except OrganizationFaq.DoesNotExist as e:
            logger.exception(f"FAQ not found for update with id {pk}: {e}")
            return Response(
                {"error": "FAQ not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != faq.org.created_by and not request.user.is_staff:
            return Response(
                {"detail": "You are not authorized to update this FAQ."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(faq, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        logger.info(f"FAQ updated: {faq.id}")

        return Response(
            {"message": "FAQ updated successfully."}, status=status.HTTP_200_OK
        )


# MARK: Social Link


class OrganizationSocialLinkViewSet(viewsets.ModelViewSet[OrganizationSocialLink]):
    queryset = OrganizationSocialLink.objects.all()
    serializer_class = OrganizationSocialLinkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def delete(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        org: Organization = serializer.validated_data["org"]

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to delete social links for this organization."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        OrganizationSocialLink.objects.filter(org=org).delete()
        logger.info(f"Social links deleted for org {org.id}")

        return Response(
            {"message": "Social links deleted successfully."},
            status=status.HTTP_201_CREATED,
        )

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        org: Organization = serializer.validated_data["org"]

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to create social links for this organization."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save()
        logger.info(f"Social link created for org {org.id}")

        return Response(
            {"message": "Social link created successfully."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request: Request, pk: UUID | str) -> Response:
        try:
            social_link = OrganizationSocialLink.objects.get(id=pk)

        except OrganizationSocialLink.DoesNotExist as e:
            logger.exception(f"Social link with id {pk} does not exist for update: {e}")
            return Response(
                {"detail": "Social link not found."}, status=status.HTTP_404_NOT_FOUND
            )

        org = social_link.org
        if org is not None:
            creator = org.created_by

        else:
            raise ValueError("Org is None.")

        if request.user != creator and not request.user.is_staff:
            return Response(
                {
                    "detail": "You are not authorized to update the social links for this organization."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(social_link, request.data, partial=True)
        if serializer.is_valid():
            serializer.save(org=org)

            return Response(
                {"message": "Social link updated successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST
        )


# MARK: Text


class OrganizationTextViewSet(viewsets.ModelViewSet[OrganizationText]):
    queryset = OrganizationText.objects.all()
    serializer_class = OrganizationTextSerializer


# MARK: Image


class OrganizationImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def list(self, request: Request, org_id: UUID) -> Response:
        images = self.queryset.filter(organizationimage__org_id=org_id).order_by(
            "organizationimage__sequence_index"
        )
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)

    def update(self, request: Request, org_id: UUID, pk: UUID | str) -> Response:
        sequence_index = request.data.get("sequence_index", None)
        if sequence_index is not None:
            # Update OrganizationImage, not the Image itself
            from .models import OrganizationImage  # or your import path

            try:
                org_image = OrganizationImage.objects.get(org_id=org_id, image_id=pk)
                org_image.sequence_index = sequence_index
                org_image.save()
                return Response(
                    {"detail": "Sequence index updated."}, status=status.HTTP_200_OK
                )
            except OrganizationImage.DoesNotExist:
                return Response(
                    {"detail": "OrganizationImage relation not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        # fallback to default image update if needed
        return super().update(request)
