import re

from events.models import Format
from rest_framework import serializers
from utils.utils import (
    validate_creation_and_deprecation_dates,
    validate_creation_and_deletion_dates,
    validate_object_existence,
    validate_flags_number,
    validate_empty
)
from django.utils.translation import gettext as _

from .models import Resource, ResourceTopic, Task, Topic, TopicFormat


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_empty(data["url"], "url")
        validate_empty(data["topics"], "topics")
        validate_empty(data["location"], "location")

        if type(data["total_flags"]) != int:
            data["total_flags"] = int(data["total_flags"])

        validate_flags_number(data)

        if not re.match(r"https?://\S+", data["url"]):
            raise serializers.ValidationError(
                _("The field url must have a valid format - https://www.example.com."),
                code="invalid_url",
            )

        validate_creation_and_deletion_dates(data)

        return data


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_empty(data["location"], "location")

        validate_creation_and_deletion_dates(data)

        return data


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"

    def validate(self, data):
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")

        if data["active"] == True and data["deprecation_date"] != None:
            raise serializers.ValidationError(
                "Active topics cannot have a deprecation date."
            )

        if data["active"] == False and data["deprecation_date"] == None:
            raise serializers.ValidationError(
                "Inactive topics must have a deprecation date."
            )

        validate_creation_and_deprecation_dates(data)

        return data


class ResourceTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceTopic
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Resource, data["resource_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class TopicFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicFormat
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Topic, data["topic_id"])
        validate_object_existence(Format, data["format_id"])

        return data
