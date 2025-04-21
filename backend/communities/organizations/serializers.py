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
from content.serializers import LocationSerializer, ResourceSerializer
from events.serializers import EventSerializer

# MARK: Main Tables


class OrganizationSocialLinkSerializer(
    serializers.ModelSerializer[OrganizationSocialLink]
):
    """
    Return a serialized representation of an OrganizationSocialLink.
    """

    class Meta:
        """
        Metaclass for the OrganizationSocialLink.
        """

        model = OrganizationSocialLink
        fields = "__all__"


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    """
    Return a serialized representation of an OrganizationText.
    """

    class Meta:
        """
        Metaclass for the OrganizationText.
        """

        model = OrganizationText
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Return a serialized representation of an Organization.
    """

    texts = OrganizationTextSerializer(many=True, read_only=True)
    social_links = OrganizationSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer(read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        """
        Metaclass for the Organization.
        """

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
            Data to validate.

        Returns
        -------
        dict[str, Any]
            Validated data.
        """
        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an organization."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Organization:
        """
        Create an organization with default text.

        Parameters
        ----------
        validated_data : dict[str, Any]
            Validate data.

        Returns
        -------
        Organization
            Create Organization.
        """
        org = Organization.objects.create(**validated_data)

        if org:
            OrganizationText.objects.create(org=org)

        return org


# MARK: Bridge Tables


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    """
    Return a serialized representation of an OrganizationApplication.
    """

    class Meta:
        """
        Metaclass for the OrganizationApplication.
        """

        model = OrganizationApplication
        fields = "__all__"


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    """
    Return a serialized representation of an OrganizationMember.
    """

    class Meta:
        """
        Metaclass for the OrganizationMember.
        """

        model = OrganizationMember
        fields = "__all__"


class OrganizationImageSerializer(serializers.ModelSerializer[OrganizationImage]):
    """
    Return a serialized representation of an OrganizationImage.
    """

    class Meta:
        """
        Metaclass for the OrganizationImage.
        """

        model = OrganizationImage
        fields = "__all__"


class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    """
    Return a serialized representation of an OrganizationTask.
    """

    class Meta:
        """
        Metaclass for the OrganizationTask.
        """

        model = OrganizationTask
        fields = "__all__"
