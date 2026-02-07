# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the events app.
"""

import logging
import zoneinfo
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Union
from uuid import UUID

from django.conf import settings
from django.db import transaction
from django.utils.dateparse import parse_datetime
from rest_framework import serializers

from communities.groups.models import Group
from communities.organizations.models import Organization
from content.models import Location, Topic
from content.serializers import FaqSerializer, ImageSerializer, LocationSerializer, TopicSerializer
from events.models import (
    Event,
    EventFaq,
    EventFlag,
    EventResource,
    EventSocialLink,
    EventText,
    EventTime,
    Format,
)
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
            logger.info("Event found for value: %s", value)

        except Event.DoesNotExist as e:
            raise serializers.ValidationError("Event not found.") from e

        return event


# MARK: Resource


class EventResourceSerializer(serializers.ModelSerializer[EventResource]):
    """
    Serializer for EventResource model data.
    """

    topics = serializers.SlugRelatedField(
        queryset=Topic.objects.filter(active=True),
        many=True,
        slug_field="type",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = EventResource
        fields = "__all__"
        read_only_fields = ["created_by"]

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
            logger.info("Event found for value: %s", value)

        except Event.DoesNotExist as e:
            raise serializers.ValidationError("Event not found.") from e

        return event

# Mark: Times

class EventTimesSerializer(serializers.ModelSerializer[EventTime]):
    """
    Serializer for EventTime model data.
    """

    class Meta:
        model = EventTime
        fields = "__all__"

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
            logger.info("Event found for value: %s", value)

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


# MARK: Group


class EventGroupSerializer(serializers.ModelSerializer[Group]):
    """
    Serializer for Group model data specific to events.
    """

    class Meta:
        model = Group
        fields = "__all__"


# MARK: POST


class EventPOSTLocationSerializer(serializers.Serializer[Any]):
    """
    Serializer for event location during creation.
    """

    address_or_name = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    country_code = serializers.CharField(required=True)
    lat = serializers.CharField(required=True)
    lon = serializers.CharField(required=True)
    bbox = serializers.ListField(
        child=serializers.CharField(), required=False, allow_empty=True
    )


class EventPOSTTimesSerializer(serializers.Serializer[Any]):
    """
    Serializer for event times during creation.
    """

    date = serializers.DateField(required=False)
    all_day = serializers.BooleanField(required=True)
    start_time = serializers.DateTimeField(required=False)
    end_time = serializers.DateTimeField(required=False)


class EventPOSTSerializer(serializers.Serializer[Any]):
    """
    Serializer for creating events with related fields.
    """

    orgs: serializers.ListSerializer[Any] = serializers.ListSerializer(
        child=serializers.UUIDField(), required=True
    )
    groups: serializers.ListSerializer[Any] = serializers.ListSerializer(
        child=serializers.UUIDField(), required=False
    )
    iso = serializers.CharField(required=False, max_length=3, default="en")
    name = serializers.CharField(required=True)
    tagline = serializers.CharField(required=False, min_length=3, max_length=255)
    description = serializers.CharField(required=True, min_length=1, max_length=2500)
    location_type = serializers.ChoiceField(
        choices=[("physical", "Physical"), ("online", "Online")], required=True
    )
    type = serializers.ChoiceField(
        choices=[("learn", "Learn"), ("action", "Action")], required=True
    )
    topics: serializers.ListSerializer[Any] = serializers.ListSerializer(
        child=serializers.CharField(), required=True, max_length=255
    )
    online_location_link = serializers.URLField(required=False, allow_blank=True)
    location = EventPOSTLocationSerializer(required=False)
    times = EventPOSTTimesSerializer(required=True, many=True)
    iso = serializers.CharField(required=False, default="en", max_length=3)

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate event creation data.

        Parameters
        ----------
        data : Dict[str, Any]
            Event creation data dictionary to validate.

        Returns
        -------
        Dict[str, Any]
            Validated data dictionary.

        Raises
        ------
        ValidationError
            If validation fails for any field.
        """
        orgs = data.pop("orgs")
        times: list[dict[str, Any]] = data.get("times")
        groups = data.pop("groups", None)
        topics = data.pop("topics", None)

        orgs = Organization.objects.filter(id__in=orgs)
        data["orgs"] = orgs

        # Get the local timezone from Django settings
        local_tz = zoneinfo.ZoneInfo(settings.TIME_ZONE)

        for time in times:
            if time.get("all_day"):
                date = time.get("date")
                # For all-day events, create times in the local timezone
                # so that 00:00:00 to 23:59:59 stays in that timezone
                time["start_time"] = datetime.combine(
                    date, datetime.min.time(), tzinfo=local_tz
                )
                time["end_time"] = datetime.combine(
                    date, datetime.min.time(), tzinfo=local_tz
                ) + timedelta(days=1, seconds=-1)

                continue

            start_time = time.get("start_time")
            end_time = time.get("end_time")

            print(start_time, end_time)

            if not start_time or not end_time:
                raise serializers.ValidationError(
                    "Both start_time and end_time are required for each event time."
                )

            if start_time >= end_time:
                raise serializers.ValidationError(
                    "start_time must be before end_time for each event time."
                )

        if topics:
            query_topics = Topic.objects.filter(type__in=topics, active=True)

            if len(query_topics) != len(topics):
                raise serializers.ValidationError(
                    "One or more topics are invalid or inactive."
                )

            data["topics"] = query_topics

        if groups:
            query_groups = Group.objects.filter(id__in=groups, org__in=orgs).distinct()

            if len(query_groups) != len(groups):
                raise serializers.ValidationError("One or more groups do not exist.")
            data["groups"] = query_groups

        return data

    def create(self, validated_data: Dict[str, Any]) -> Event:
        """
        Create an event from validated data.

        Parameters
        ----------
        validated_data : Dict[str, Any]
            Validated event creation data.

        Returns
        -------
        Event
            Created Event instance.
        """
        created_by = validated_data.pop("created_by")

        with transaction.atomic():
            location_type = validated_data.pop("location_type", None)
            location_data = validated_data.pop("location", None)
            description = validated_data.pop("description")
            orgs_data = validated_data.pop("orgs", [])
            groups_data = validated_data.pop("groups", [])
            topics_data = validated_data.pop("topics", [])
            times_data = validated_data.pop("times", [])
            description = validated_data.pop("description", "")
            iso = validated_data.pop("iso")

            if location_data and location_type == "physical":
                location = Location.objects.create(**location_data)
                validated_data["physical_location"] = location

            event = Event.objects.create(created_by=created_by, **validated_data)

            # Create EventText object with description
            event_text = EventText.objects.create(
                iso=iso,
                primary=True,
                description=description,
            )
            event.texts.add(event_text)

            # Set many-to-many relationships
            if orgs_data:
                event.orgs.set(orgs_data)
            if groups_data:
                event.groups.set(groups_data)
            if topics_data:
                event.topics.set(topics_data)

            event.texts.set(description=description, iso=iso, primary=True)

            if times_data:
                event_times = [
                    EventTime(
                        start_time=time_data.get("start_time"),
                        end_time=time_data.get("end_time"),
                        all_day=time_data.get("all_day", False),
                    )
                    for time_data in times_data
                ]
                EventTime.objects.bulk_create(event_times)
                event.times.set(event_times)

        return event


# MARK: Event


class EventSerializer(serializers.ModelSerializer[Event]):
    """
    Serializer for Event model data.
    """

    texts = EventTextSerializer(many=True, read_only=True)
    social_links = EventSocialLinkSerializer(many=True, read_only=True)
    physical_location = LocationSerializer()
    resources = EventResourceSerializer(many=True, read_only=True)
    faq_entries = FaqSerializer(source="faqs", many=True, read_only=True)
    orgs = EventOrganizationSerializer(many=True, read_only=True)
    groups = EventGroupSerializer(many=True, read_only=True)
    topics = TopicSerializer(many=True, read_only=True)
    times = EventTimesSerializer(many=True, read_only=True)

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
                (
                    "The creation date must be before the deletion date, and both of them should be a future date."
                ),
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
            True if the start is after the end time, or start is before current time (invalid).
            False otherwise (valid).
        """
        curr_dt = datetime.now(timezone.utc)
        # Convert to datetime if they're strings.
        start_dt = parse_datetime(start) if isinstance(start, str) else start
        end_dt = parse_datetime(end) if isinstance(end, str) else end

        return (
            isinstance(start_dt, datetime)
            and isinstance(end_dt, datetime)
            and (start_dt >= end_dt or start_dt < curr_dt)
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
