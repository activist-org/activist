# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for groups in the communities app.
"""

import logging
from typing import Any
from uuid import UUID

from django.db import IntegrityError, OperationalError
from rest_framework import serializers

from communities.groups.models import (
    Group,
    GroupFaq,
    GroupFlag,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupSocialLink,
    GroupText,
)
from communities.organizations.models import Organization
from content.models import Location, Topic
from content.serializers import LocationSerializer, TopicSerializer
from events.serializers import EventSerializer

logger = logging.getLogger(__name__)

# MARK: FAQ


class GroupFaqSerializer(serializers.ModelSerializer[GroupFaq]):
    """
    Serializer for GroupFaq model data.
    """

    class Meta:
        model = GroupFaq
        fields = "__all__"

    def validate_group(self, value: Group | UUID | str) -> Group:
        """
        Validate that the group exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Group instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the group does not exist.

        Returns
        -------
        Group
            The validated Group instance.
        """
        if isinstance(value, Group):
            return value

        try:
            group = Group.objects.get(id=value)
            logger.info("Group found for value: %s", value)

        except Group.DoesNotExist as e:
            raise serializers.ValidationError("Group not found.") from e

        return group


# MARK: Resource


class GroupResourceSerializer(serializers.ModelSerializer[GroupResource]):
    """
    Serializer for GroupResource model data.
    """

    topics = serializers.SlugRelatedField(
        queryset=Topic.objects.filter(active=True),
        many=True,
        slug_field="type",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = GroupResource
        fields = "__all__"
        read_only_fields = ["created_by"]

    def validate_group(self, value: Group | UUID | str) -> Group:
        """
        Validate that the group exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Group instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the group does not exist.

        Returns
        -------
        Group
            The validated Group instance.
        """
        if isinstance(value, Group):
            return value

        try:
            group = Group.objects.get(id=value)
            logger.info("Group found for value: %s", value)

        except Group.DoesNotExist as e:
            raise serializers.ValidationError("Group not found.") from e

        return group


# MARK: Social Link


class GroupSocialLinkSerializer(serializers.ModelSerializer[GroupSocialLink]):
    """
    Serializer for GroupSocialLink model data.
    """

    class Meta:
        model = GroupSocialLink
        fields = "__all__"

    def validate_group(self, value: Group | UUID | str) -> Group:
        """
        Validate that the group exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Group instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the group does not exist.

        Returns
        -------
        Group
            The validated Group instance.
        """
        if isinstance(value, Group):
            return value

        try:
            group = Group.objects.get(id=value)
            logger.info("Group found for value: %s", value)

        except Group.DoesNotExist as e:
            raise serializers.ValidationError("Group not found.") from e

        return group


# MARK: Text


class GroupTextSerializer(serializers.ModelSerializer[GroupText]):
    """
    Serializer for GroupText model data.
    """

    class Meta:
        model = GroupText
        fields = "__all__"


# MARK: Organization


class GroupOrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for GroupOrganization model data.
    """

    class Meta:
        model = Organization
        fields = "__all__"


# MARK: POST


class GroupPOSTSerializer(serializers.Serializer[Group]):
    """
    Serializer for creating groups with related fields.
    """

    name = serializers.CharField(max_length=255)
    tagline = serializers.CharField(max_length=255, required=False, allow_blank=True)
    description = serializers.CharField(max_length=2500)
    org = serializers.UUIDField()
    topics = TopicSerializer(many=True, required=False)
    country_code = serializers.CharField(max_length=3)
    city = serializers.CharField(max_length=255)

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        return data

    def create(self, validated_data: dict[str, Any]) -> Group:
        location_data = {
            "city": validated_data.pop("city"),
            "country_code": validated_data.pop("country_code"),
            "lat": "",
            "lon": "",
        }
        location = Location.objects.create(**location_data)
        try:
            org = Organization.objects.get(id=validated_data.pop("org"))
            group = Group.objects.create(location=location, org=org, **validated_data)
            logger.info("Created Group with id: %s", group.id)
            return group
        except (Organization.DoesNotExist, IntegrityError, OperationalError) as e:
            location.delete()
            raise e


# MARK: Group


class GroupSerializer(serializers.ModelSerializer[Group]):
    """
    Serializer for Group model data.
    """

    texts = GroupTextSerializer(many=True, read_only=True)
    social_links = GroupSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer()
    resources = GroupResourceSerializer(many=True, read_only=True)
    faq_entries = GroupFaqSerializer(source="faqs", many=True, read_only=True)
    org = GroupOrganizationSerializer(read_only=True)
    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        extra_kwargs = {
            "created_by": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Validate the data before creating a group.

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
                "You must accept the terms of service to create a group."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Group:
        """
        Create and return a new Group instance.

        Parameters
        ----------
        validated_data : dict[str, Any]
            Data from a request to validate.

        Returns
        -------
        Group
            A new Group instance.
        """
        group = Group.objects.create(**validated_data)

        if group:
            GroupText.objects.create(group=group)

        return group


# MARK: Flag


class GroupFlagSerializer(serializers.ModelSerializer[GroupFlag]):
    """
    Serializers for GroupFlag model.
    """

    class Meta:
        model = GroupFlag
        fields = "__all__"


# MARK: Image


class GroupImageSerializer(serializers.ModelSerializer[GroupImage]):
    """
    Serializer for GroupImage model data.
    """

    class Meta:
        model = GroupImage
        fields = "__all__"


# MARK: Member


class GroupMemberSerializer(serializers.ModelSerializer[GroupMember]):
    """
    Serializer for GroupMember model data.
    """

    class Meta:
        model = GroupMember
        fields = "__all__"
