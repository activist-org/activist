"""
Serializers for the events app.
"""

from typing import Any, Dict, Union

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
    EventDiscussion,
    EventFaq,
    EventFormat,
    EventResource,
    EventRole,
    EventSocialLink,
    EventTag,
    EventTask,
    EventText,
    EventTopic,
    Format,
    Role,
)

# MARK: Main Tables


class EventTextSerializer(serializers.ModelSerializer[EventText]):
    class Meta:
        model = EventText
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer[Event]):
    event_text = EventTextSerializer(read_only=True)
    description = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Event

        extra_kwargs = {
            "created_by": {"read_only": True},
            "description": {"write_only": True},
        }

        fields = [
            "id",
            "created_by",
            "name",
            "tagline",
            "icon_url",
            "type",
            "online_location_link",
            "offline_location",
            "is_private",
            "start_time",
            "end_time",
            "event_text",
            "description",
        ]

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if parse_datetime(data["start_time"]) > parse_datetime(data["end_time"]):  # type: ignore
            raise serializers.ValidationError(
                _("The start time cannot be after the end time."),
                code="invalid_time_order",
            )

        validate_creation_and_deletion_dates(data)

        return data

    def create(self, validated_data: dict[str, Any]) -> Event:
        description = validated_data.pop("description", None)
        event = Event.objects.create(**validated_data)

        if event and description:
            event_text = EventText.objects.create(
                event_id=event, description=description
            )
            event.event_text = event_text

        return event


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


class EventDiscussionSerializer(serializers.ModelSerializer[EventDiscussion]):
    class Meta:
        model = EventDiscussion
        fields = "__all__"


class EventFaqSerializer(serializers.ModelSerializer[EventFaq]):
    class Meta:
        model = EventFaq
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


class EventSocialLinkSerializer(serializers.ModelSerializer[EventSocialLink]):
    class Meta:
        model = EventSocialLink
        fields = "__all__"


class EventTagSerializer(serializers.ModelSerializer[EventTag]):
    class Meta:
        model = EventTag
        fields = "__all__"


class EventTaskSerializer(serializers.ModelSerializer[EventTask]):
    class Meta:
        model = EventTask
        fields = "__all__"


class EventTopicSerializer(serializers.ModelSerializer[EventTopic]):
    class Meta:
        model = EventTopic
        fields = "__all__"
