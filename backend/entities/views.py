# mypy: disable-error-code="override"
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from backend.paginator import CustomPagination

from .models import (
    Group,
    GroupEvent,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupText,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationEvent,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationText,
    OrganizationTopic,
    Status,
    StatusType,
)
from .serializers import (
    GroupEventSerializer,
    GroupImageSerializer,
    GroupMemberSerializer,
    GroupResourceSerializer,
    GroupSerializer,
    GroupTextSerializer,
    GroupTopicSerializer,
    OrganizationApplicationSerializer,
    OrganizationEventSerializer,
    OrganizationImageSerializer,
    OrganizationMemberSerializer,
    OrganizationResourceSerializer,
    OrganizationSerializer,
    OrganizationTaskSerializer,
    OrganizationTextSerializer,
    OrganizationTopicSerializer,
    StatusSerializer,
    StatusTypeSerializer,
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
        data = {"message": f"New Group created: {serializer.data}"}

        return Response(data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, *args: str, **kwargs: int) -> Response:
        group = self.queryset.get(id=kwargs["pk"])
        serializer = self.get_serializer(group)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request: Request, *args: str, **kwargs: int) -> Response:
        group = self.queryset.filter(id=kwargs["pk"]).first()

        if group is None:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if request.user != group.created_by:
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

        if request.user != group.created_by:
            return Response(
                {"error": "You are not authorized to delete this group"},
                status.HTTP_401_UNAUTHORIZED,
            )

        group.delete()

        return Response(
            {"message": "Group deleted successfully"}, status=status.HTTP_200_OK
        )


class OrganizationViewSet(viewsets.ModelViewSet[Organization]):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    pagination_class = CustomPagination
    throttle_classes = [AnonRateThrottle, UserRateThrottle]
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def create(self, request: Request) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        org = serializer.save(created_by=request.user)
        OrganizationApplication.objects.create(org_id=org)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        if org := self.queryset.filter(id=pk).first():
            serializer = self.get_serializer(org)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Organization not found"}, status.HTTP_404_NOT_FOUND)

    def list(self, request: Request) -> Response:
        serializer = self.get_serializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request: Request, pk: str | None = None) -> Response:
        org = self.queryset.filter(id=pk).first()
        if org is None:
            return Response(
                {"error": "Organization not found"}, status.HTTP_404_NOT_FOUND
            )

        if request.user != org.created_by:
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

        if request.user != org.created_by:
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

        if request.user != org.created_by:
            return Response(
                {"error": "You are not authorized to delete this organization"},
                status.HTTP_401_UNAUTHORIZED,
            )

        org.status = StatusType.objects.get(id=3)  # 3 is the id of the deleted status
        org.deletion_date = timezone.now()
        org.is_high_risk = False
        org.status_updated = None
        org.tagline = ""
        org.social_links = []
        org.save()

        return Response(
            {"message": "Organization deleted successfully"}, status.HTTP_200_OK
        )


class StatusViewSet(viewsets.ModelViewSet[Status]):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    pagination_class = CustomPagination


# MARK: Bridge Tables


class GroupEventViewSet(viewsets.ModelViewSet[GroupEvent]):
    queryset = GroupEvent.objects.all()
    serializer_class = GroupEventSerializer
    pagination_class = CustomPagination


class GroupImageViewSet(viewsets.ModelViewSet[GroupImage]):
    queryset = GroupImage.objects.all()
    serializer_class = GroupImageSerializer
    pagination_class = CustomPagination


class GroupMemberViewSet(viewsets.ModelViewSet[GroupMember]):
    queryset = GroupMember.objects.all()
    serializer_class = GroupMemberSerializer
    pagination_class = CustomPagination


class GroupResourceViewSet(viewsets.ModelViewSet[GroupResource]):
    queryset = GroupResource.objects.all()
    serializer_class = GroupResourceSerializer
    pagination_class = CustomPagination


class GroupTextViewSet(viewsets.ModelViewSet[GroupText]):
    queryset = GroupText.objects.all()
    serializer_class = GroupTextSerializer
    pagination_class = CustomPagination


class GroupTopicViewSet(viewsets.ModelViewSet[GroupTopic]):
    queryset = GroupTopic.objects.all()
    serializer_class = GroupTopicSerializer
    pagination_class = CustomPagination


class OrganizationApplicationViewSet(viewsets.ModelViewSet[OrganizationApplication]):
    queryset = OrganizationApplication.objects.all()
    serializer_class = OrganizationApplicationSerializer
    pagination_class = CustomPagination


class OrganizationEventViewSet(viewsets.ModelViewSet[OrganizationEvent]):
    queryset = OrganizationEvent.objects.all()
    serializer_class = OrganizationEventSerializer
    pagination_class = CustomPagination


class OrganizationMemberViewSet(viewsets.ModelViewSet[OrganizationMember]):
    queryset = OrganizationMember.objects.all()
    serializer_class = OrganizationMemberSerializer
    pagination_class = CustomPagination


class OrganizationImageViewSet(viewsets.ModelViewSet[OrganizationImage]):
    queryset = OrganizationImage.objects.all()
    serializer_class = OrganizationImageSerializer


class OrganizationResourceViewSet(viewsets.ModelViewSet[OrganizationResource]):
    queryset = OrganizationResource.objects.all()
    serializer_class = OrganizationResourceSerializer
    pagination_class = CustomPagination


class OrganizationTaskViewSet(viewsets.ModelViewSet[OrganizationTask]):
    queryset = OrganizationTask.objects.all()
    serializer_class = OrganizationTaskSerializer
    pagination_class = CustomPagination


class OrganizationTextViewSet(viewsets.ModelViewSet[OrganizationText]):
    queryset = OrganizationText.objects.all()
    serializer_class = OrganizationTextSerializer
    pagination_class = CustomPagination


class OrganizationTopicViewSet(viewsets.ModelViewSet[OrganizationTopic]):
    queryset = OrganizationTopic.objects.all()
    serializer_class = OrganizationTopicSerializer
    pagination_class = CustomPagination


class StatusTypeViewSet(viewsets.ModelViewSet[StatusType]):
    queryset = StatusType.objects.all()
    serializer_class = StatusTypeSerializer
    pagination_class = CustomPagination
