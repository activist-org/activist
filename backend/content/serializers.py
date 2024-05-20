"""
Serializers for the content app.
"""

from typing import Dict, Union

from django.utils.translation import gettext as _
from PIL import Image as PilImage
from rest_framework import serializers

from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
)

from .models import (
    Discussion,
    DiscussionEntry,
    DiscussionTag,
    Faq,
    Image,
    IsoCodeMap,
    Resource,
    ResourceTag,
    ResourceTopic,
    Tag,
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
            "created_by",
            "text",
            "creation_date",
            "deletion_date",
        ]


class FaqSerializer(serializers.ModelSerializer[Faq]):
    class Meta:
        model = Faq
        fields = ["id", "question", "org_id", "answer", "last_updated"]


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    class Meta:
        model = Resource
        fields = [
            "name",
            "description",
            "category",
            "url",
            "is_private",
            "created_by",
            "creation_date",
            "last_updated",
        ]


class TaskSerializer(serializers.ModelSerializer[Task]):
    class Meta:
        model = Task
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_creation_and_deletion_dates(data)

        return data


class TopicSerializer(serializers.ModelSerializer[Topic]):
    class Meta:
        model = Topic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if data["active"] is True and data["deprecation_date"] is not None:
            raise serializers.ValidationError(
                _("Active topics cannot have a deprecation date."),
                code="active_topic_with_deprecation_error",
            )

        if data["active"] is False and data["deprecation_date"] is None:
            raise serializers.ValidationError(
                _("Deprecated topics must have a deprecation date."),
                code="inactive_topic_no_deprecation_error",
            )

        validate_creation_and_deprecation_dates(data)

        return data


class TagSerializer(serializers.ModelSerializer[Tag]):
    class Meta:
        model = Tag
        fields = "__all__"


class ResourceTopicSerializer(serializers.ModelSerializer[ResourceTopic]):
    class Meta:
        model = ResourceTopic
        fields = "__all__"


class ResourceTagSerializer(serializers.ModelSerializer[ResourceTag]):
    class Meta:
        model = ResourceTag
        fields = "__all__"


class TopicFormatSerializer(serializers.ModelSerializer[TopicFormat]):
    class Meta:
        model = TopicFormat
        fields = "__all__"


class DiscussionTagSerializer(serializers.ModelSerializer[DiscussionTag]):
    class Meta:
        model = DiscussionTag
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer[Image]):
    class Meta:
        model = Image
        fields = ["id", "image_location", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        image_extensions = [".jpg", ".jpeg", ".png"]
        img_format = ""

        try:
            with PilImage.open(data["image_location"]) as img:
                img.verify()
                img_format = img.format.lower()
        except Exception:
            raise serializers.ValidationError(
                _("The image is not valid."), code="corrupted_file"
            )

        if img_format not in image_extensions:
            raise serializers.ValidationError(
                _("The image must be in jpg, jpeg or png format."),
                code="invalid_extension",
            )

        return data


class IsoCodeMapSerializer(serializers.ModelSerializer[IsoCodeMap]):
    class Meta:
        model = IsoCodeMap
        fields = "__all__"
