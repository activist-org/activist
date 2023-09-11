from rest_framework import serializers
from .models import *
import re
from events.models import Format
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
    validate_empty,
    validate_flags_number,
    validate_object_existence,
)


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
                    "url must be a valid url - https://www.example.com"
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
                    "active topics cannot have a deprecation date"
                )

            if data["active"] == False and data["deprecation_date"] == None:
                raise serializers.ValidationError(
                    "inactive topics must have a deprecation date"
                )

            validate_creation_and_deprecation_dates(data)

            return data


class ResourceTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceTopic
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(
            Resource, data["resource_id"], "resource_id does not exist"
        )
        validate_object_existence(Topic, data["topic_id"], "topic_id does not exist")

        return data


class TopicFormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopicFormat
        fields = "__all__"

    def validate(self, data):
        validate_object_existence(Topic, data["topic_id"], "topic_id does not exist")
        validate_object_existence(Format, data["format_id"], "format_id does not exist")

        return data
