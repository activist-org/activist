# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the events app.
"""

import logging
from datetime import datetime
from typing import Any, Dict, Union
from uuid import UUID

from django.utils.dateparse import parse_datetime
from rest_framework import serializers

from communities.organizations.models import Organization
from content.serializers import (
    FaqSerializer,
    ImageSerializer,
    LocationSerializer,
    ResourceSerializer,
)
from events.models import Event, EventFaq, EventFlag, EventSocialLink, EventText, Format
from utils.utils import (
    validate_creation_and_deprecation_dates,
)

logger = logging.getLogger(__name__)

# MARK: FAQ


class EventFaqSerializer(serializers.ModelSerializer[EventFaq]):
    """
    Serializer for EventFaq model data.
    """

    class Meta:
        model = EventFaq
        fields = "__all__"

    def validate_event(self, value: Event | UUID | str) -> Event:
        """
        Validate that the event exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Event instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the event does not exist.

        Returns
        -------
        Event
            The validated Event instance.
        """
        if isinstance(value, Event):
            return value

        try:
            event = Event.objects.get(id=value)

        except Event.DoesNotExist as e:
            logger.exception(f"Event with id {value} not found.")
            raise serializers.ValidationError("Event not found.") from e

        return event


# MARK: Social Link


class EventSocialLinkSerializer(serializers.ModelSerializer[EventSocialLink]):
    """
    Serializer for EventSocialLink model data.
    """

    class Meta:
        model = EventSocialLink
        fields = "__all__"

    def validate_event(self, value: Event | UUID | str) -> Event:
        """
        Validate that the event exists.

        Parameters
        ----------
        value : Any
            The value to validate, expected to be a Event instance, UUID or str.

        Raises
        -------
        serializers.ValidationError
            If the event does not exist.

        Returns
        -------
        Event
            The validated Event instance.
        """
        if isinstance(value, Event):
            return value

        try:
            event = Event.objects.get(id=value)

        except Event.DoesNotExist as e:
            raise serializers.ValidationError("Event not found.") from e

        return event


# MARK: Text


class EventTextSerializer(serializers.ModelSerializer[EventText]):
    """
    Serializer for EventText model data.
    """

    class Meta:
        model = EventText
        fields = "__all__"


# MARK: Organization


class EventOrganizationSerializer(serializers.ModelSerializer[Organization]):
    """
    Serializer for Organization model data specific to events.
    """

    class Meta:
        model = Organization
        fields = "__all__"


# MARK: POST


class EventPOSTSerializer(serializers.ModelSerializer[Event]):
    """
    Serializer for creating events with related fields.
    """

    texts = EventTextSerializer(write_only=True, required=False)
    social_links = EventSocialLinkSerializer(write_only=True, required=False)
    offline_location = LocationSerializer(write_only=True)
    org_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(), source="orgs"
    )

    class Meta:
        model = Event

        exclude = (
            "resources",
            "discussions",
            "formats",
            "roles",
            "tags",
            "tasks",
            "topics",
            "orgs",
            "created_by",
            "get_involved_url",
            "icon_url",
            "deletion_date",
        )


# MARK: Event


class EventSerializer(serializers.ModelSerializer[Event]):
    """
    Serializer for Event model data.
    """

    texts = EventTextSerializer(many=True, read_only=True)
    social_links = EventSocialLinkSerializer(many=True, read_only=True)
    offline_location = LocationSerializer()
    resources = ResourceSerializer(many=True, read_only=True)
    faq_entries = FaqSerializer(source="faqs", many=True, read_only=True)
    orgs = EventOrganizationSerializer(read_only=True)

    icon_url = ImageSerializer(required=False)

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

        # Verify start is before end if both times are provided.
        if start and end and self._invalid_dates(start, end):
            raise serializers.ValidationError(
                ("The start time cannot be after the end time."),
                code="invalid_time_order",
            )

        creation_date = data.get("creation_date")
        deletion_date = data.get("deletion_date")

        # Verify creation_date is before deletion_date if both times are provided.
        if (
            creation_date
            and deletion_date
            and self._invalid_dates(creation_date, deletion_date)
        ):
            raise serializers.ValidationError(
                ("The creation date cannot be after the deletion date."),
                code="invalid_date_order",
            )

        terms_checked = data.get("terms_checked")

        # If data.get("terms_checked") is False.
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
        logger.info(f"Created Event with id {event.id}")

        if event:
            EventText.objects.create(event=event)
            logger.info(f"Created EventText for Event id {event.id}")

        return event

    def _invalid_dates(self, start: Union[int, str], end: Union[int, str]) -> bool:
        """
        Validate that start date is before end date.

        Parameters
        ----------
        start : int, str
            A datetime or string for the start of a time period.

        end : int, str
            A datetime or string for the end of a time period.

        Returns
        -------
        bool
            True if the start is after the end (invalid).
            False otherwise (valid).
        """

        # Convert to datetime if they're strings.
        start_dt = parse_datetime(start) if isinstance(start, str) else start
        end_dt = parse_datetime(end) if isinstance(end, str) else end

        return (
            isinstance(start_dt, datetime)
            and isinstance(end_dt, datetime)
            and start_dt > end_dt
        )


# MARK: Flag


class EventFlagSerializers(serializers.ModelSerializer[EventFlag]):
    """
    Serializers for EventFlag Model.
    """

    class Meta:
        model = EventFlag
        fields = "__all__"


# MARK: Format


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
