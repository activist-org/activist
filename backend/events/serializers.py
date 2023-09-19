from authentication.models import User
from content.models import Resource, Task, Topic
from django.utils.translation import gettext as _
from rest_framework import serializers
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
    EventTask,
    EventTopic,
    Format,
    Role,
)


class EventSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Event
        fields = "__all__"

    def validate(self, data):
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
        ]

        def isEmpty():
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

        validate_creation_and_deletion_dates(data)
        validate_object_existence(User, data["created_by"])

        return data


class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_creation_and_deprecation_dates(data)
        validate_creation_and_deletion_dates(data)

        return data


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_creation_and_deprecation_dates(data)

        return data


class EventAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["user_id"], "user_id")
        validate_empty(data["role_id"], "role_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(User, data["user_id"])
        validate_object_existence(Role, data["role_id"])

        return data


class EventFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFormat
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["format_id"], "format_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Format, data["format_id"])

        return data


class EventAttendeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendeeStatus
        fields = "__all__"


class EventResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventResource
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["event_id"], "event_id")
        validate_empty(data["resource_id"], "resource_id")
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Resource, data["resource_id"])

        return data


class EventRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRole
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Role, data["role_id"])

        return data


class EventTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTask
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Task, data["task_id"])

        return data


class EventTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTopic
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Event, data["event_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data
