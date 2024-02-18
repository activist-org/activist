from typing import Any, Dict, Union

from django.utils.translation import gettext as _
from rest_framework import serializers

from events.models import Format
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
    validate_empty,
    validate_object_existence,
)
from .models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Resource,
    ResourceTopic,
    Task,
    Topic,
    TopicFormat,
)


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    class Meta:
        model = Discussion
        fields = [
            "id",
            "created_by",
            "org_id",
            "group_id",
            "event_id",
            "category",
            "creation_date",
            "deletion_date",
        ]


class DiscussionEntrySerializer(serializers.ModelSerializer[DiscussionEntry]):
    class Meta:
        model = DiscussionEntry
        fields = [
            "id",
            "discussion_id",
            "user_id",
            "text",
            "creation_date",
            "deletion_date",
        ]


class FaqSerializer(serializers.ModelSerializer[Faq]):
    class Meta:
        model = Faq
        fields = ["id", "name", "question", "org_id", "answer", "last_updated"]


class ImageSerializer(serializers.ModelSerializer[Image]):
    class Meta:
        model = Image
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        # TODO: not sure what validation should be performance.
        return data


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    class Meta:
        model = Resource
        fields = [
            "name",
            "description",
            "topics",
            "category",
            "url",
            "private",
            "total_flags",
        ]

    def validate(self, data: Dict[str, Union[str, Any]]) -> Dict[str, Union[str, Any]]:
        if total_flags := data.get("total_flags") is not None:
            if not isinstance(total_flags, int):
                raise serializers.ValidationError(
                    _("Total flags must be an integer value.")
                )
        return data


class TaskSerializer(serializers.ModelSerializer[Task]):
    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")
        validate_empty(data["location"], "location")
        validate_creation_and_deletion_dates(data)

        return data


class TopicSerializer(serializers.ModelSerializer[Topic]):
    class Meta:
        model = Topic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_empty(data["name"], "name")
        validate_empty(data["description"], "description")

        if data["active"] is True and data["deprecation_date"] is not None:
            raise serializers.ValidationError(
                "Active topics cannot have a deprecation date."
            )

        if data["active"] is False and data["deprecation_date"] is None:
            raise serializers.ValidationError(
                "Inactive topics must have a deprecation date."
            )

        validate_creation_and_deprecation_dates(data)

        return data


class ResourceTopicSerializer(serializers.ModelSerializer[ResourceTopic]):
    class Meta:
        model = ResourceTopic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Resource, data["resource_id"])
        validate_object_existence(Topic, data["topic_id"])

        return data


class TopicFormatSerializer(serializers.ModelSerializer[TopicFormat]):
    class Meta:
        model = TopicFormat
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_object_existence(Topic, data["topic_id"])
        validate_object_existence(Format, data["format_id"])

        return data
