"""
Serializers for the events app.
"""

from typing import Dict, Union

from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _
from rest_framework import serializers

from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
)

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTag,
    EventTask,
    EventText,
    EventTopic,
    Format,
    Role,
)

# MARK: Main Tables


class EventSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Event
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if parse_datetime(data["start_time"]) > parse_datetime(data["end_time"]):  # type: ignore
            raise serializers.ValidationError(
                _("The start time cannot be after the end time."),
                code="invalid_time_order",
            )

        validate_creation_and_deletion_dates(data)

        return data


class FormatSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Format
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_creation_and_deprecation_dates(data)

        return data


class RoleSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Role
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_creation_and_deprecation_dates(data)

        return data


# MARK: Bridge Tables


class EventAttendeeSerializer(serializers.ModelSerializer[EventAttendee]):
    class Meta:
        model = EventAttendee
        fields = "__all__"


class EventAttendeeStatusSerializer(serializers.ModelSerializer[EventAttendeeStatus]):
    class Meta:
        model = EventAttendeeStatus
        fields = "__all__"


class EventFormatSerializer(serializers.ModelSerializer[EventFormat]):
    class Meta:
        model = EventFormat
        fields = "__all__"


class EventResourceSerializer(serializers.ModelSerializer[EventResource]):
    class Meta:
        model = EventResource
        fields = "__all__"


class EventRoleSerializer(serializers.ModelSerializer[EventRole]):
    class Meta:
        model = EventRole
        fields = "__all__"


class EventTagSerializer(serializers.ModelSerializer[EventTag]):
    class Meta:
        model = EventTag
        fields = "__all__"


class EventTaskSerializer(serializers.ModelSerializer[EventTask]):
    class Meta:
        model = EventTask
        fields = "__all__"


class EventTextSerializer(serializers.ModelSerializer[EventText]):
    class Meta:
        model = EventText
        fields = "__all__"


class EventTopicSerializer(serializers.ModelSerializer[EventTopic]):
    class Meta:
        model = EventTopic
        fields = "__all__"
