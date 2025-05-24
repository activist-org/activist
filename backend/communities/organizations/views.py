# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for organization management.
"""

import json
from typing import Dict, List
from uuid import UUID

from django.db import transaction
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
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from communities.models import StatusType
from communities.organizations.models import (
    Organization,
    OrganizationFaq,
    OrganizationSocialLink,
    OrganizationText,
)
from communities.organizations.serializers import (
    OrganizationFaqSerializer,
    OrganizationSerializer,
    OrganizationSocialLinkSerializer,
    OrganizationTextSerializer,
)
from content.models import Image, Location
from content.serializers import ImageSerializer
from core.paginator import CustomPagination

# MARK: Organization


class OrganizationAPIView(GenericAPIView[Organization]):
    queryset = Organization.objects.all().order_by("id")
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

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

        except (IntegrityError, OperationalError):
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"error": "Failed to create organization"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        org.application.create()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
                        value={"error": "Organization ID is required"},
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
                        value={"error": "Failed to retrieve the organization"},
                        media_type="application/json",
                    )
                ],
            ),
        },
    )
    def get(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Organization ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.get(id=id)
            serializer = OrganizationSerializer(org)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response(
                {"error": "Failed to retrieve the organization"},
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
                        value={"error": "Organization ID is required"},
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
                        value={"error": "Organization not found"},
                        media_type="application/json",
                    )
                ],
            ),
        }
    )
    def put(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Organization ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.get(id=id)

        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this organization"},
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
                        value={"error": "Organization ID is required"},
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
                            "error": "You are not authorized to delete this organization"
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
                        value={"error": "Organization not found"},
                        media_type="application/json",
                    )
                ],
            ),
        },
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        if id is None:
            return Response(
                {"error": "Organization ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            org = Organization.objects.select_related("created_by").get(id=id)

        except Organization.DoesNotExist:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to delete this organization"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        org.status = StatusType.objects.get(id=3)  # 3 is the id of the deleted status
        org.deletion_date = timezone.now()
        org.is_high_risk = False
        org.status_updated = None
        org.tagline = ""
        org.save()

        return Response(
            {"message": "Organization deleted successfully."}, status.HTTP_200_OK
        )


# MARK: Bridge Tables


class OrganizationSocialLinkViewSet(viewsets.ModelViewSet[OrganizationSocialLink]):
    queryset = OrganizationSocialLink.objects.all()
    serializer_class = OrganizationSocialLinkSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        org = Organization.objects.filter(id=pk).first()
        if not org:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                # Delete all existing social links for this org.
                OrganizationSocialLink.objects.filter(org=org).delete()

                # Create new social links from the submitted data.
                social_links: List[Dict[str, str]] = []
                for link_data in data:
                    if isinstance(link_data, dict):
                        social_link = OrganizationSocialLink.objects.create(
                            org=org,
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
        
class OrganizationFaqViewSet(viewsets.ModelViewSet[OrganizationFaq]):
    queryset = OrganizationFaq.objects.all()
    serializer_class = OrganizationFaqSerializer

    def update(self, request: Request, pk: UUID | str) -> Response:
        organization = Organization.objects.filter(id=pk).first()
        if not organization:
            return Response(
                {"error": "Organization not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        if isinstance(data, str):
            data = json.loads(data)

        try:
            # Use transaction.atomic() to ensure nothing is saved if an error occurs.
            with transaction.atomic():
                # Delete all existing faqs for this Organization.
                OrganizationFaq.objects.filter(organization=organization).delete()

                # Create new faqs from the submitted data.
                faqs: List[Dict[str, str]] = []
                for link_data in data:
                    if isinstance(link_data, dict):
                        faq = OrganizationFaq.objects.create(
                            organization=organization,
                            question=link_data.get("question"),
                            answer=link_data.get("answer"),
                        )
                        faqs.append(faq)

            serializer = self.get_serializer(faqs, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Failed to update faqs: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )



class OrganizationTextViewSet(viewsets.ModelViewSet[OrganizationText]):
    queryset = OrganizationText.objects.all()
    serializer_class = OrganizationTextSerializer


class OrganizationImageViewSet(viewsets.ModelViewSet[Image]):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def list(self, request: Request, org_id: UUID) -> Response:
        images = self.queryset.filter(organizationimage__org_id=org_id).order_by(
            "organizationimage__sequence_index"
        )
        serializer = self.get_serializer(images, many=True)
        return Response(serializer.data)
