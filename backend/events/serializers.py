from rest_framework import serializers

from .models import *
from utils.utils import validate_creation_and_deletion_dates, validate_creation_and_deprecation_dates

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = (
            "id",
            "name",
            "tagline",
            "type",
            "description",
            "get_involved_text",
            "online_location_link",
            "offline_location_name",
            "offline_location_lat",
            "offline_location_long",
            "start_time",
            "end_time",
            "created_by",
            "creation_date",
            "deletion_date",
        )

    def validate(self, data):
    
        if data["name"] == "" or data["tagline"] == "" or data["type"] == "" or data["description"] == "" or data["get_involved_text"] == "" or data["online_location_link"] == "" or data["offline_location_name"] == "" or data or data["created_by"] == "":
            raise serializers.ValidationError(
                "only the offline_location_lat and offline_location_long fields can be empty"
            )
        
        data = validate_creation_and_deletion_dates(data)

        return data

class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = (
            "id",
            "name",
            "description",
            "creation_date",
            "last_updated",
            "deprecation_date",
        )

    def validate(self, data):
    
        if data["name"] == "" or data["description"] == "":
            raise serializers.ValidationError(
                "the name and description fields cannot be empty"
            )
        data = validate_creation_and_deprecation_dates(data)
        data = validate_creation_and_deletion_dates(data)
        return data

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "is_custom",
            "description",
            "creation_date",
            "last_updated",
            "deprecation_date",
        )

        def validate(self, data):
    
            if data["name"] == "" or data["description"] == "":
                raise serializers.ValidationError(
                    "the name and description fields cannot be empty"
                )
            data = validate_creation_and_deprecation_dates(data)
            return data

class EventAttendeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendee
        fields = (
            "id",
            "event_id",
            "user_id",
            "status",
            "creation_date",
            "status_updated",
        )

    def validate(self, data):
    
        if data["event_id"] == "" or data["user_id"] == "" or data["role_id"] == "":
            raise serializers.ValidationError(
                "event_id, user_id and role_id cannot be empty"
            )
        return data


class EventFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFormat
        fields = ("id", "event", "format")

class EventAttendeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendeeStatus
        fields = ("id", "status_name")

class EventResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventResource
        fields = ("event_id", "resource_id")


class EventRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRole
        fields = ("event_id", "role_id")


class EventTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTask
        fields = ("event_id", "task_id")

class EventTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTopic
        fields = ("event_id", "topic_id")
