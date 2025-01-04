# mypy: disable-error-code="override"
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from core.paginator import CustomPagination

from .models import (
    Group,
    Organization,
    OrganizationApplication,
    Status,
    StatusType,
)
from .serializers import (
    GroupSerializer,
    OrganizationSerializer,
    StatusSerializer,
)

# MARK: Main Tables


class GroupViewSet(viewsets.ModelViewSet[Group]):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = CustomPagination

    def list(self, request: Request, *args: str, **kwargs: int) -> Response:
        serializer = self.get_serializer(self.queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        data = {"message": f"New group created: {serializer.data}."}

        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        if group := self.queryset.get(id=kwargs["pk"]):
            serializer = self.get_serializer(group)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Group not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, pk: str | None = None) -> Response:
        group = self.queryset.filter(id=pk).first()

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
        group = self.queryset.filter(id=kwargs["pk"]).first()

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
        group = self.queryset.filter(id=kwargs["pk"]).first()

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


class OrganizationViewSet(viewsets.ModelViewSet[Organization]):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination

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

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if org := self.queryset.filter(id=pk).first():
            serializer = self.get_serializer(org)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Organization not found"}, status.HTTP_404_NOT_FOUND)

    def update(self, request: Request, pk: str | None = None) -> Response:
        org = self.queryset.filter(id=pk).first()
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
        org = self.queryset.filter(id=pk).first()
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
        org = self.queryset.filter(id=pk).first()
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


class StatusViewSet(viewsets.ModelViewSet[Status]):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    pagination_class = CustomPagination
