"""
Serializers for the communities app.
"""

from typing import Any

from rest_framework import serializers

from content.serializers import LocationSerializer, ResourceSerializer
from events.serializers import EventSerializer

from .models import (
    Group,
    GroupImage,
    GroupMember,
    GroupText,
    Organization,
    OrganizationApplication,
    OrganizationImage,
    OrganizationMember,
    OrganizationTask,
    OrganizationText,
    Status,
    StatusType,
)

# MARK: Main Tables


class GroupTextSerializer(serializers.ModelSerializer[GroupText]):
    class Meta:
        model = GroupText
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer[Group]):
    texts = GroupTextSerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)
    events = EventSerializer(many=True, read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        extra_kwargs = {
            "created_by": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create a group."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Group:
        group = Group.objects.create(**validated_data)

        if group:
            GroupText.objects.create(group=group)

        return group


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    class Meta:
        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    texts = OrganizationTextSerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)
    events = EventSerializer(many=True, read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Organization

        extra_kwargs = {
            "created_by": {"read_only": True},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an organization."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Organization:
        org = Organization.objects.create(**validated_data)

        if org:
            OrganizationText.objects.create(org=org)

        return org


class StatusSerializer(serializers.ModelSerializer[Status]):
    class Meta:
        model = Status
        fields = "__all__"


# MARK: Bridge Tables


class GroupImageSerializer(serializers.ModelSerializer[GroupImage]):
    class Meta:
        model = GroupImage
        fields = "__all__"


class GroupMemberSerializer(serializers.ModelSerializer[GroupMember]):
    class Meta:
        model = GroupMember
        fields = "__all__"


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    class Meta:
        model = OrganizationApplication
        fields = "__all__"


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    class Meta:
        model = OrganizationMember
        fields = "__all__"


class OrganizationImageSerializer(serializers.ModelSerializer[OrganizationImage]):
    class Meta:
        model = OrganizationImage
        fields = "__all__"


class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    class Meta:
        model = OrganizationTask
        fields = "__all__"


class StatusTypeSerializer(serializers.ModelSerializer[StatusType]):
    class Meta:
        model = StatusType
        fields = "__all__"
