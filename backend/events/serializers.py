from typing import Dict, Union

from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _
from rest_framework import serializers
from authentication.models import User
from content.models import Resource, Task, Topic
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
    validate_empty,
    validate_object_existence,
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
    EventTopic,
    Format,
    Role,
)


class EventSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Event
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        required_fields = [
            "name",
            "tagline",
            "type",
            "description",
            "get_involved_text",
            "start_time",
            "end_time",
            "created_by",
            "creation_date",
            "deletion_date",
            "event_icon",
        ]

        def isEmpty() -> bool:
            for field in required_fields:
                if data[field] == "" or data[field] is None:
                    return True
            return False

        if isEmpty():
            raise serializers.ValidationError(
                _(
                    "Only the fields offline_location_lat and offline_location_long fields can be empty for Events."
                ),
                code="invalid_value",
            )
        
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError(
                _("The start time cannot be after the end time."), code="invalid_time_order"
            )

        validate_creation_and_deletion_dates(data)
        validate_object_existence(User, data["created_by"])

        return data


class FormatSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Format
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_creation_and_deprecation_dates(data)

        return data


class RoleSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Role
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_creation_and_deprecation_dates(data)

        return data


class EventAttendeeSerializer(serializers.ModelSerializer[EventAttendee]):
    class Meta:
        model = EventAttendee
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["user_id"], "user_id")
        validate_empty(data["role_id"], "role_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Role, data["role_id"])

        return data


class EventFormatSerializer(serializers.ModelSerializer[EventFormat]):
    class Meta:
        model = EventFormat
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["format_id"], "format_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Format, data["format_id"])

        return data


class EventAttendeeStatusSerializer(serializers.ModelSerializer[EventAttendeeStatus]):
    class Meta:
        model = EventAttendeeStatus
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["status_name"], "status_name")

        return data


class EventResourceSerializer(serializers.ModelSerializer[EventResource]):
    class Meta:
        model = EventResource
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["resource_id"], "resource_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class EventRoleSerializer(serializers.ModelSerializer[EventRole]):
    class Meta:
        model = EventRole
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Role, data["role_id"])

        return data


class EventTaskSerializer(serializers.ModelSerializer[EventTask]):
    class Meta:
        model = EventTask
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Task, data["task_id"])

        return data


class EventTopicSerializer(serializers.ModelSerializer[EventTopic]):
    class Meta:
        model = EventTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class EventTagSerializer(serializers.ModelSerializer[EventTag]):
    class Meta:
        model = EventTag
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Topic, data["tag_id"])

        return data
