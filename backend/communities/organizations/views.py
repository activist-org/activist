# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
import json
from typing import Dict, List
from uuid import UUID

from django.db import transaction
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from communities.models import StatusType
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationSocialLink,
    OrganizationText,
)
from communities.organizations.serializers import (
    OrganizationSerializer,
    OrganizationSocialLinkSerializer,
    OrganizationTextSerializer,
)
from core.paginator import CustomPagination
from core.settings import (
    CACHE_DURATION,
    ORGANIZATION_LIST_CACHE_PREFIX,
    ORGANIZATION_RETRIEVE_CACHE_PREFIX,
)

# MARK: Main Tables


class OrganizationViewSet(viewsets.ModelViewSet[Organization]):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=ORGANIZATION_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request) -> Response:
        serializer = self.get_serializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        org = serializer.save(created_by=request.user)
        OrganizationApplication.objects.create(org=org)
        data = {"message": f"New organization created: {serializer.data}"}

        return Response(data, status=status.HTTP_201_CREATED)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=ORGANIZATION_RETRIEVE_CACHE_PREFIX)
    )
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if pk is not None:
            if org := self.queryset.filter(id=pk).first():
                serializer = self.get_serializer(org)

                return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"error": "Organization not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, pk: str | None = None) -> Response:
        if pk is not None:
            org = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if org is None:
            return Response(
                {"error": "Organization not found"}, status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this organization"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(org, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_200_OK)

    def partial_update(self, request: Request, pk: str | None = None) -> Response:
        if pk is not None:
            org = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if org is None:
            return Response(
                {"error": "Organization not found"}, status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this organization"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(org, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_200_OK)

    def destroy(self, request: Request, pk: str | None = None) -> Response:
        if pk is not None:
            org = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if org is None:
            return Response(
                {"error": "Organization not found"}, status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to delete this organization"},
                status.HTTP_401_UNAUTHORIZED,
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
