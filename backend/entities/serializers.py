"""
Serializers for the entities app.
"""

from typing import Any

from rest_framework import serializers

from events.serializers import EventSerializer

from .models import (
    Group,
    GroupEvent,
    GroupFaq,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupSocialLink,
    GroupText,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationDiscussion,
    OrganizationEvent,
    OrganizationFaq,
    OrganizationGroup,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationSocialLink,
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
    class Meta:
        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    org_text = OrganizationTextSerializer()
    org_events = EventSerializer(many=True, read_only=True)  # to be tested

    class Meta:
        model = Organization

        extra_kwargs = {
            "created_by": {"read_only": True},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }

        # fields = [
        #     "id",
        #     "created_by",
        #     "org_name",
        #     "name",
        #     "tagline",
        #     "icon_url",
        #     "location_id",
        #     "get_involved_url",
        #     "terms_checked",
        #     "is_high_risk",
        #     "status",
        #     "status_updated",
        #     "acceptance_date",
        # ]
        fields = "__all__"

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


class GroupFaqSerializer(serializers.ModelSerializer[GroupFaq]):
    class Meta:
        model = GroupFaq
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


class GroupSocialLinkSerializer(serializers.ModelSerializer[GroupSocialLink]):
    class Meta:
        model = GroupSocialLink
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


class OrganizationDiscussionSerializer(
    serializers.ModelSerializer[OrganizationDiscussion]
):
    class Meta:
        model = OrganizationDiscussion
        fields = "__all__"


class OrganizationEventSerializer(serializers.ModelSerializer[OrganizationEvent]):
    events = EventSerializer(source="event_id", read_only=True)  # many=True removed

    class Meta:
        model = OrganizationEvent
        fields = ["org_id", "events"]


class OrganizationFaqSerializer(serializers.ModelSerializer[OrganizationFaq]):
    class Meta:
        model = OrganizationFaq
        fields = "__all__"


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


class OrganizationSocialLinkSerializer(
    serializers.ModelSerializer[OrganizationSocialLink]
):
    class Meta:
        model = OrganizationSocialLink
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
