from rest_framework import serializers

from .models import *


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

class EventAttendeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventAttendeeStatus
        fields = (
            "id",
            "name",
            "description",
            "creation_date",
            "last_updated",
            "deprecation_date",
        )

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
