# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for groups in the communities app.
"""

from typing import Any

from rest_framework import serializers

from communities.groups.models import (
    Group,
    GroupImage,
    GroupMember,
    GroupSocialLink,
    GroupText,
)
from communities.organizations.models import Organization
from content.serializers import LocationSerializer, ResourceSerializer
from events.serializers import EventSerializer

# MARK: Main Tables


class GroupSocialLinkSerializer(serializers.ModelSerializer[GroupSocialLink]):
    class Meta:
        model = GroupSocialLink
        fields = "__all__"


class GroupTextSerializer(serializers.ModelSerializer[GroupText]):
    class Meta:
        model = GroupText
        fields = "__all__"


class GroupOrganizationSerializer(serializers.ModelSerializer[Organization]):
    class Meta:
        model = Organization
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer[Group]):
    texts = GroupTextSerializer(many=True, read_only=True)
    social_links = GroupSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer()
    resources = ResourceSerializer(many=True, read_only=True)
    org = GroupOrganizationSerializer(read_only=True)
    events = EventSerializer(many=True, read_only=True)

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


# MARK: Bridge Tables


class GroupImageSerializer(serializers.ModelSerializer[GroupImage]):
    class Meta:
        model = GroupImage
        fields = "__all__"


class GroupMemberSerializer(serializers.ModelSerializer[GroupMember]):
    class Meta:
        model = GroupMember
        fields = "__all__"
