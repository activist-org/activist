"""
Serializers for the entities app.
"""

from typing import Any

from rest_framework import serializers

from events.serializers import EventSerializer

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
    OrganizationGroup,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationText,
    OrganizationTopic,
    Status,
    StatusType,
)

# MARK: Main Tables


class GroupSerializer(serializers.ModelSerializer[Group]):
    class Meta:
        model = Group
        fields = "__all__"


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    orgID = serializers.StringRelatedField(source="org_id.id")

    class Meta:
        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    org_text = OrganizationTextSerializer(read_only=True)
    description = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Organization

        extra_kwargs = {
            "created_by": {"read_only": True},
            "social_links": {"required": False},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
            "description": {"write_only": True},
        }

        fields = [
            "id",
            "org_name",
            "name",
            "tagline",
            "icon_url",
            "location",
            "created_by",
            "social_links",
            "is_high_risk",
            "status",
            "status_updated",
            "acceptance_date",
            "terms_checked",
            "org_text",
            "description",
        ]

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an organization."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Organization:
        description = validated_data.pop("description", None)
        org = Organization.objects.create(**validated_data)

        if org and description:
            org_text = OrganizationText.objects.create(
                org_id=org, description=description
            )
            org.org_text = org_text

        return org


class StatusSerializer(serializers.ModelSerializer[Status]):
    class Meta:
        model = Status
        fields = "__all__"


# MARK: Bridge Tables


class GroupEventSerializer(serializers.ModelSerializer[GroupEvent]):
    class Meta:
        model = GroupEvent
        fields = "__all__"


class GroupImageSerializer(serializers.ModelSerializer[GroupImage]):
    class Meta:
        model = GroupImage
        fields = "__all__"


class GroupMemberSerializer(serializers.ModelSerializer[GroupMember]):
    class Meta:
        model = GroupMember
        fields = "__all__"


class GroupResourceSerializer(serializers.ModelSerializer[GroupResource]):
    class Meta:
        model = GroupResource
        fields = "__all__"


class GroupTextSerializer(serializers.ModelSerializer[GroupText]):
    class Meta:
        model = GroupText
        fields = "__all__"


class GroupTopicSerializer(serializers.ModelSerializer[GroupTopic]):
    class Meta:
        model = GroupTopic
        fields = "__all__"


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    class Meta:
        model = OrganizationApplication
        fields = "__all__"


class OrganizationEventSerializer(serializers.ModelSerializer[OrganizationEvent]):
    events = EventSerializer(source="event_id", read_only=True)  # many=True removed

    class Meta:
        model = OrganizationEvent
        fields = ["org_id", "events"]


class OrganizationGroupSerializer(serializers.ModelSerializer[OrganizationGroup]):
    groups = GroupSerializer(source="group_id", read_only=True)  # many=True removed

    class Meta:
        model = OrganizationEvent
        fields = ["org_id", "groups"]


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    class Meta:
        model = OrganizationMember
        fields = "__all__"


class OrganizationImageSerializer(serializers.ModelSerializer[OrganizationImage]):
    class Meta:
        model = OrganizationImage
        fields = "__all__"


class OrganizationResourceSerializer(serializers.ModelSerializer[OrganizationResource]):
    class Meta:
        model = OrganizationResource
        fields = "__all__"


class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    class Meta:
        model = OrganizationTask
        fields = "__all__"


class OrganizationTopicSerializer(serializers.ModelSerializer[OrganizationTopic]):
    class Meta:
        model = OrganizationTopic
        fields = "__all__"


class StatusTypeSerializer(serializers.ModelSerializer[StatusType]):
    class Meta:
        model = StatusType
        fields = "__all__"
