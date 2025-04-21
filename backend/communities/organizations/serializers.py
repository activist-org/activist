# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for organizations in the communities app.
"""

from typing import Any

from rest_framework import serializers

from communities.groups.serializers import GroupSerializer
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationImage,
    OrganizationMember,
    OrganizationSocialLink,
    OrganizationTask,
    OrganizationText,
)
from content.serializers import ImageSerializer, LocationSerializer, ResourceSerializer
from events.serializers import EventSerializer

# MARK: Organization


class OrganizationSocialLinkSerializer(
    serializers.ModelSerializer[OrganizationSocialLink]
):
    class Meta:
        model = OrganizationSocialLink
        fields = "__all__"


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    class Meta:
        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    texts = OrganizationTextSerializer(many=True, read_only=True)
    social_links = OrganizationSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer()
    resources = ResourceSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    events = EventSerializer(many=True, read_only=True)
    icon_url = ImageSerializer()

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


# MARK: Bridge Tables


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
