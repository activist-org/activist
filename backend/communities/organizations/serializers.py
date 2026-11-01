# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for organizations in the communities app.
"""

import logging
from typing import Any
from uuid import UUID

from django.db import IntegrityError, OperationalError, transaction
from rest_framework import serializers

from communities.groups.serializers import GroupSerializer
from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationFaq,
    OrganizationFlag,
    OrganizationImage,
    OrganizationMember,
    OrganizationResource,
    OrganizationSocialLink,
    OrganizationSupportFromOrg,
    OrganizationSupportFromUser,
    OrganizationTask,
    OrganizationText,
)
from content.models import Location, Topic
from content.serializers import ImageSerializer, LocationSerializer, TopicSerializer
from events.models import Event
from events.serializers import EventSerializer, EventTextSerializer
from utils.utils import validate_entity_exists

logger = logging.getLogger(__name__)

# MARK: FAQ


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
        value : Organization | UUID | str
            The value to validate: an Organization instance, UUID, or string id.

        Returns
        -------
        Organization
            The validated Organization instance.

        Raises
        ------
        serializers.ValidationError
            If the organization does not exist.
        """
        return validate_entity_exists(
            manager=Organization.objects,
            value=value,
            not_found_message="Organization not found.",
        )


# MARK: Resource


class OrganizationResourceSerializer(serializers.ModelSerializer[OrganizationResource]):
    """
    Serializer for OrganizationResource model data.
    """

    topics = serializers.SlugRelatedField(
        queryset=Topic.objects.filter(active=True),
        many=True,
        slug_field="type",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = OrganizationResource
        fields = "__all__"
        read_only_fields = ["created_by"]

    def validate_org(self, value: Organization | UUID | str) -> Organization:
        """
        Validate that the organization exists.

        Parameters
        ----------
        value : Organization | UUID | str
            The value to validate: an Organization instance, UUID, or string id.

        Returns
        -------
        Organization
            The validated Organization instance.

        Raises
        ------
        serializers.ValidationError
            If the organization does not exist.
        """
        return validate_entity_exists(
            manager=Organization.objects,
            value=value,
            not_found_message="Organization not found.",
        )


# MARK: Social Link


class OrganizationSocialLinkSerializer(
    serializers.ModelSerializer[OrganizationSocialLink]
):
    """
    Serializer for OrganizationSocialLink model data.
    """

    class Meta:
        model = OrganizationSocialLink
        fields = "__all__"

    def validate_org(self, value: Organization | UUID | str) -> Organization:
        """
        Validate that the organization exists.

        Parameters
        ----------
        value : Organization | UUID | str
            The value to validate: an Organization instance, UUID, or string id.

        Returns
        -------
        Organization
            The validated Organization instance.

        Raises
        ------
        serializers.ValidationError
            If the organization does not exist.
        """
        return validate_entity_exists(
            manager=Organization.objects,
            value=value,
            not_found_message="Organization not found.",
        )


# MARK: Text


class OrganizationTextSerializer(serializers.ModelSerializer[OrganizationText]):
    """
    Serializer for OrganizationText model data.
    """

    class Meta:
        model = OrganizationText
        fields = "__all__"


# MARK: Support


class OrganizationSupportedEventSerializer(serializers.ModelSerializer["Event"]):
    """
    Lightweight event serializer for a organization's supported events.
    """

    texts = EventTextSerializer(many=True, read_only=True)
    topics = serializers.SlugRelatedField(
        queryset=Topic.objects.filter(active=True),
        many=True,
        slug_field="type",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "tagline",
            "type",
            "location_type",
            "creation_date",
            "texts",
            "topics",
        ]


class OrganizationSupportedOrganizationSerializer(
    serializers.ModelSerializer["Organization"]
):
    """
    Lightweight serializer for a organization's supported organizations.
    """

    texts = OrganizationTextSerializer(many=True, read_only=True)
    topics = serializers.SlugRelatedField(
        queryset=Topic.objects.filter(active=True),
        many=True,
        slug_field="type",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Organization
        fields = ["id", "name", "tagline", "texts", "topics", "events"]


# MARK: Organization


class OrganizationPOSTSerializer(serializers.Serializer[Organization]):
    """
    Serializer for Organization model data on POST requests.
    """

    name = serializers.CharField(max_length=255)
    tagline = serializers.CharField(max_length=255, required=False, allow_blank=True)
    description = serializers.CharField(max_length=2500)
    topics = TopicSerializer(many=True, required=False)
    country_code = serializers.CharField(max_length=3, default="en")
    city = serializers.CharField(max_length=255)

    def validate(self, data: dict[str, Any]) -> dict[str, Any]:
        """
        Validate the data being posted.

        Parameters
        ----------
        data : dict[str, Any]
            The data to be posted.

        Returns
        -------
        dict[str, Any]
            Validated data after validation completes.
        """
        return data

    def create(self, validated_data: dict[str, Any]) -> Organization:
        """
        Create an organization via a post operation.

        Parameters
        ----------
        validated_data : dict[str, Any]
            Data to be used in the creation of an organization.

        Returns
        -------
        Organization
            The organization object that was created in the database.
        """
        with transaction.atomic():
            city = validated_data.pop("city")
            country_code = validated_data.pop("country_code")
            description = validated_data.pop("description", "")
            # iso = validated_data.pop("iso")

            location_data = {
                "city": city,
                "country_code": country_code,
                "lat": "",
                "lon": "",
            }
            location = Location.objects.create(**location_data)

            try:
                org = Organization.objects.create(location=location, **validated_data)

                org_text = OrganizationText.objects.create(
                    org=org,
                    # iso=iso,
                    primary=True,
                    description=description,
                )
                org.texts.set([org_text])

                logger.info(f"Created Organization with id: {org.id}")

                return org

            except (IntegrityError, OperationalError) as e:
                location.delete()
                raise e


class OrganizationListSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for listing Organization model data.
    """

    texts = OrganizationTextSerializer(many=True, read_only=True)
    location = LocationSerializer()
    icon_url = ImageSerializer(required=False)

    class Meta:
        model = Organization
        extra_kwargs = {
            "created_by": {"read_only": True},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }
        fields = ["id", "name", "tagline", "location", "topics", "texts", "icon_url"]


class OrganizationEventListSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for listing Organization model data with events.
    """

    events = EventSerializer(many=True, read_only=True)

    class Meta:
        model = Organization
        extra_kwargs = {
            "created_by": {"read_only": True},
            "status_updated": {"read_only": True},
            "acceptance_date": {"read_only": True},
        }
        fields = ["id", "events"]


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for Organization model data.
    """

    texts = OrganizationTextSerializer(many=True, read_only=True)
    social_links = OrganizationSocialLinkSerializer(many=True, read_only=True)
    location = LocationSerializer()
    resources = OrganizationResourceSerializer(many=True, read_only=True)
    faq_entries = OrganizationFaqSerializer(source="faqs", many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)
    events = EventSerializer(many=True, read_only=True)

    icon_url = ImageSerializer(required=False)

    supported_organizations = OrganizationSupportedOrganizationSerializer(
        many=True, read_only=True
    )
    supported_events = OrganizationSupportedEventSerializer(many=True, read_only=True)

    supporter_count = serializers.SerializerMethodField()
    is_supported_by_org = serializers.SerializerMethodField()
    is_supported_by_user = serializers.SerializerMethodField()

    def get_supporter_count(self, obj: Organization) -> int:
        """
        Get the count of users who support the organization.

        Parameters
        ----------
        obj : Organization
            The organization to check support for.

        Returns
        -------
        int
            The total organizations and users that support the organization.
        """
        return int(
            getattr(obj, "_user_supporter_count", None) or obj.supporters_users.count()
        ) + int(
            getattr(obj, "_org_supporter_count", None) or obj.supporters_orgs.count()
        )

    def get_is_supported_by_org(self, obj: Organization) -> bool:
        """
        Check whether an organization is supported by an other organization that is derived via a request.

        Parameters
        ----------
        obj : Organization
            The organization to check supporters for.

        Returns
        -------
        bool
            Whether the included organization in the request supports the organization or not.
        """
        annotated = obj.org_supporters.exists()
        if annotated is None:
            return False

        request = self.context.get("request")
        if request is None or not request.user.id:
            return False

        return bool(obj.org_supporters.filter(pk=request.user.pk).exists())

    def get_is_supported_by_user(self, obj: Organization) -> bool:
        """
        Check whether an organization is supported by a user that is derived via a request.

        Parameters
        ----------
        obj : Organization
            The organization to check supporters for.

        Returns
        -------
        bool
            Whether the included user in the request supports the organization or not.
        """
        annotated = obj.user_supporters.exists()
        if annotated is None:
            return False

        request = self.context.get("request")
        if request is None or not request.user.id:
            return False

        return bool(obj.user_supporters.filter(pk=request.user.pk).exists())

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
        logger.info(f"Created Organization with id: {org.id}")

        if org:
            OrganizationText.objects.create(org=org)
            logger.info(f"Created OrganizationText for Organization id: {org.id}")

        return org


# MARK: Flag


class OrganizationFlagSerializer(serializers.ModelSerializer[OrganizationFlag]):
    """
    Serializers for OrganizationFlag Model.
    """

    class Meta:
        model = OrganizationFlag
        fields = "__all__"


# MARK: Support


class OrganizationSupportFromOrgSerializer(
    serializers.ModelSerializer[OrganizationSupportFromOrg]
):
    """
    Serializer for OrganizationSupportFromOrg model data.
    """

    class Meta:
        model = OrganizationSupportFromOrg
        fields = "__all__"


class OrganizationSupportFromUserSerializer(
    serializers.ModelSerializer[OrganizationSupportFromUser]
):
    """
    Serializer for OrganizationSupportFromUser model data.
    """

    class Meta:
        model = OrganizationSupportFromUser
        fields = "__all__"


# MARK: Application


class OrganizationApplicationSerializer(
    serializers.ModelSerializer[OrganizationApplication]
):
    """
    Serializer for OrganizationApplication model data.
    """

    class Meta:
        model = OrganizationApplication
        fields = "__all__"


# MARK: Image


class OrganizationImageSerializer(serializers.ModelSerializer[OrganizationImage]):
    """
    Serializer for OrganizationImage model data.
    """

    class Meta:
        model = OrganizationImage
        fields = "__all__"


# MARK: Member


class OrganizationMemberSerializer(serializers.ModelSerializer[OrganizationMember]):
    """
    Serializer for OrganizationMember model data.
    """

    class Meta:
        model = OrganizationMember
        fields = "__all__"


# MARK: Task


class OrganizationTaskSerializer(serializers.ModelSerializer[OrganizationTask]):
    """
    Serializer for OrganizationTask model data.
    """

    class Meta:
        model = OrganizationTask
        fields = "__all__"
