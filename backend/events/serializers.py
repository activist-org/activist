# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the events app.
"""

from typing import Any, Dict, Union

from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _
from rest_framework import serializers

from communities.organizations.models import Organization
from content.serializers import LocationSerializer, ResourceSerializer
from events.models import Event, EventSocialLink, EventText, Format
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
)

# MARK: Main Tables


class EventSocialLinkSerializer(serializers.ModelSerializer[EventSocialLink]):
    """
    Serializer for EventSocialLink model data.
    """

    class Meta:
        model = EventSocialLink
        fields = "__all__"


class EventTextSerializer(serializers.ModelSerializer[EventText]):
    """
    Serializer for EventText model data.
    """

    class Meta:
        model = EventText
        fields = "__all__"


class EventOrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for Organization model data specific to events.
    """

    class Meta:
        model = Organization
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer[Event]):
    """
    Serializer for Event model with related fields.
    """

    texts = EventTextSerializer(many=True, read_only=True)
    social_links = EventSocialLinkSerializer(many=True, read_only=True)
    offline_location = LocationSerializer(read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)
    orgs = EventOrganizationSerializer(read_only=True)

    class Meta:
        model = Event

        extra_kwargs = {
            "created_by": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        """
        Validate event data including time constraints and terms.

        Parameters
        ----------
        data : Dict[str, Union[str, int]]
            Event data dictionary to validate.

        Returns
        -------
        Dict[str, Union[str, int]]
            Validated data dictionary.

        Raises
        ------
        ValidationError
            If validation fails for any field.
        """

        start = data.get("start_time")
        end = data.get("end_time")

        # Only validate if both times are provided
        if start and end and parse_datetime(start) > parse_datetime(end):
            # if start and end and parse_datetime(start) > parse_datetime(end):  # type: ignore
            raise serializers.ValidationError(
                _("The start time cannot be after the end time."),
                code="invalid_time_order",
            )

        creation_date = data.get("creation_date")
        deletion_date = data.get("deletion_date")

        if creation_date and deletion_date:
            if parse_datetime(creation_date) > parse_datetime(deletion_date):
                raise serializers.ValidationError(
                    _("The creation date cannot be after the deletion date."),
                    code="invalid_date_order",
                )

            validate_creation_and_deletion_dates(data)

        terms_checked = data.get("terms_checked")

        # if data.get("terms_checked") is False:
        if terms_checked and terms_checked is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an event."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Event:
        """
        Create event and associated text record.

        Parameters
        ----------
        validated_data : dict[str, Any]
            Dictionary of validated data for creating the event.

        Returns
        -------
        Event
            Created Event instance.
        """
        event = Event.objects.create(**validated_data)

        if event:
            EventText.objects.create(event=event)

        return event


class FormatSerializer(serializers.ModelSerializer[Event]):
    """
    Serializer for Format model data.
    """

    class Meta:
        model = Format
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        """
        Validate format data including date constraints.

        Parameters
        ----------
        data : Dict[str, Union[str, int]]
            Format data dictionary to validate with creation and deprecation dates.

        Returns
        -------
        Dict[str, Union[str, int]]
            Validated data dictionary.

        Raises
        ------
        ValidationError
            If validation fails for dates.
        """
        validate_creation_and_deprecation_dates(data)

        return data
