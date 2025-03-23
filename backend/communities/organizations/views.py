# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
import json
from typing import Dict, List
from uuid import UUID

from django.db import transaction
from django.db.utils import IntegrityError, OperationalError
from django.utils import timezone
from drf_spectacular.utils import OpenApiResponse, extend_schema
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
    OrganizationSocialLink,
    OrganizationText,
)
from communities.organizations.serializers import (
    OrganizationSerializer,
    OrganizationSocialLinkSerializer,
    OrganizationTextSerializer,
)
from content.models import Image, Location
from content.serializers import ImageSerializer
from core.paginator import CustomPagination

# MARK: Main Tables


class OrganizationAPIView(GenericAPIView[Organization]):
    queryset = Organization.objects.all().order_by("id")
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @extend_schema(
        responses=OrganizationSerializer(many=True),
    )
    def get(self, request: Request) -> Response:
        """Returns a paginated list of organizations."""
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    def post(self, request: Request) -> Response:
        """Create a new organization"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        location_dict = serializer.validated_data["location"]
        location = Location.objects.create(**location_dict)
        serializer.validated_data["location"] = location

        # location post-cleanup if the organization creation fails,
        # necessary because of a not null constraint on the location field
        try:
            org = serializer.save(created_by=request.user)
        except (IntegrityError, OperationalError):
            Location.objects.filter(id=location.id).delete()
            return Response(
                {"error": "Failed to create organization"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        org.application.create()

        data = {"message": f"New organization created: {serializer.data}"}
        return Response(data, status=status.HTTP_201_CREATED)


class OrganizationDetailAPIView(APIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    @extend_schema(
        responses={
            200: OrganizationSerializer,
            400: OpenApiResponse(response={"error": "Organization ID is required"}),
            404: OpenApiResponse(
                response={"error": "Failed to retrieve the organization"}
            ),
        }
    )
    def get(self, request: Request, id: None | UUID = None) -> Response:
        """Retrieve a single organization by ID."""
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
            400: OpenApiResponse(response={"error": "Organization ID is required"}),
            404: OpenApiResponse(response={"error": "Organization not found"}),
        }
    )
    def put(self, request: Request, id: None | UUID = None) -> Response:
        """Update an organization by ID"""
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
        responses={
            200: OpenApiResponse(
                response={"message": "Organization deleted successfully."}
            ),
            400: OpenApiResponse(response={"error": "Organization ID is required"}),
            401: OpenApiResponse(
                response={"error": "You are not authorized to delete this organization"}
            ),
            404: OpenApiResponse(response={"error": "Organization not found"}),
        }
    )
    def delete(self, request: Request, id: None | UUID = None) -> Response:
        """Delete an organization by ID"""
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

        if request.user != org.created_by:
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
