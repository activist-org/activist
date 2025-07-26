# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for organizations in the communities app.
"""

from typing import Any
from uuid import UUID

from rest_framework import serializers

from communities.groups.serializers import GroupSerializer
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationFaq,
    OrganizationFlag,
    OrganizationImage,
    OrganizationMember,
    OrganizationSocialLink,
    OrganizationTask,
    OrganizationText,
)
from content.serializers import (
    ImageSerializer,
    LocationSerializer,
    ResourceSerializer,
)
from events.serializers import EventSerializer

# MARK: Organization


class OrganizationSocialLinkSerializer(
    serializers.ModelSerializer[OrganizationSocialLink]
):
    """
    Serializer for OrganizationSocialLink model data.
    """

    class Meta:
        model = OrganizationSocialLink
        fields = "__all__"


class OrganizationFaqSerializer(serializers.ModelSerializer[OrganizationFaq]):
    """
    Serializer for OrganizationFaq model data.
    """

    class Meta:
        model = OrganizationFaq
        fields = "__all__"

    def validate_org(self, value: Organization | UUID | str) -> Organization:
        """
        Validate that the organization exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Organization instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the organization does not exist.

        Returns
        -------
        Organization
            The validated Organization instance.
        """
        if isinstance(value, Organization):
            return value

        try:
            org = Organization.objects.get(id=value)

        except Organization.DoesNotExist as e:
            raise serializers.ValidationError("Organization not found.") from e

        return org


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    """
    Serializer for OrganizationText model data.
    """

    class Meta:
        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for Organization model data.
    """

    texts = OrganizationTextSerializer(many=True, read_only=True)
    social_links = OrganizationSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer()
    resources = ResourceSerializer(many=True, read_only=True)
    faq_entries = OrganizationFaqSerializer(source="faqs", many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    events = EventSerializer(many=True, read_only=True)

    icon_url = ImageSerializer(required=False)

    class Meta:
        model = Organization

        extra_kwargs = {
            "created_by": {"read_only": True},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Ensure terms are accepted before creation.

        Parameters
        ----------
        data : dict[str, Any]
            Data from a request to validate.

        Returns
        -------
        dict[str, Any]
            Validated data for processing.
        """
        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an organization."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Organization:
        """
        Create and return a new Organization instance.

        Parameters
        ----------
        validated_data : dict[str, Any]
            Validate data.

        Returns
        -------
        Organization
            A new  Organization instance.
        """
        org = Organization.objects.create(**validated_data)

        if org:
            OrganizationText.objects.create(org=org)

        return org


class OrganizationFlagSerializer(serializers.ModelSerializer[OrganizationFlag]):
    """
    Serializers for OrganizationFlag Model.
    """

    class Meta:
        model = OrganizationFlag
        fields = "__all__"


# MARK: Bridge Tables


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    """
    Serializer for OrganizationApplication model data.
    """

    class Meta:
        model = OrganizationApplication
        fields = "__all__"


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    """
    Serializer for OrganizationMember model data.
    """

    class Meta:
        model = OrganizationMember
        fields = "__all__"


class OrganizationImageSerializer(serializers.ModelSerializer[OrganizationImage]):
    """
    Serializer for OrganizationImage model data.
    """

    class Meta:
        model = OrganizationImage
        fields = "__all__"


class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    """
    Serializer for OrganizationTask model data.
    """

    class Meta:
        model = OrganizationTask
        fields = "__all__"
