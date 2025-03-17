# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
import json
from typing import Dict, List
from uuid import UUID

from django.db import transaction
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from communities.groups.models import Group, GroupSocialLink, GroupText
from communities.groups.serializers import (
    GroupSerializer,
    GroupSocialLinkSerializer,
    GroupTextSerializer,
)
from core.paginator import CustomPagination
from core.settings import (
    CACHE_DURATION,
    GROUP_LIST_CACHE_PREFIX,
    GROUP_RETRIEVE_CACHE_PREFIX,
)

# MARK: Main Tables


class GroupViewSet(viewsets.ModelViewSet[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = CustomPagination

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=GROUP_LIST_CACHE_PREFIX)
    )
    @vary_on_cookie
    def list(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(self.queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        data = {"message": f"New group created: {serializer.data}."}

        return Response(data, status=status.HTTP_201_CREATED)

    @method_decorator(
        cache_page(CACHE_DURATION * 60, key_prefix=GROUP_RETRIEVE_CACHE_PREFIX)
    )
    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        try:
            pk = str(kwargs["pk"])
            group = self.queryset.get(id=pk)
            serializer = self.get_serializer(group)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except group.DoesNotExist:
            return Response({"error": "Group not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, pk: str | None = None) -> Response:
        if pk is not None:
            group = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if group is None:
            return Response({"error": "Group not found"}, status.HTTP_404_NOT_FOUND)

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this group"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_200_OK)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        pk = str(kwargs["pk"])
        if pk is not None:
            group = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if group is None:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to update this group"},
                status.HTTP_401_UNAUTHORIZED,
            )

        serializer = self.get_serializer(group, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request: Request, *args: str, **kwargs: int) -> Response:
        pk = str(kwargs["pk"])
        if pk is not None:
            group = self.queryset.filter(id=pk).first()

        else:
            return Response(
                {"error": "Invalid ID."}, status=status.HTTP_400_BAD_REQUEST
            )

        if group is None:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != group.created_by and not request.user.is_staff:
            return Response(
                {"error": "You are not authorized to delete this group"},
                status.HTTP_401_UNAUTHORIZED,
            )

        group.delete()

        return Response(
            {"message": "Group deleted successfully."}, status=status.HTTP_200_OK
        )


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


class GroupTextViewSet(viewsets.ModelViewSet[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
