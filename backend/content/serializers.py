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
    Location,
    Resource,
    ResourceTag,
    ResourceTopic,
    Role,
    SocialLink,
    Tag,
    Task,
    TaskTag,
    Topic,
    TopicFormat,
)

# MARK: Main Tables


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    class Meta:
        model = Discussion
        fields = "__all__"


class FaqSerializer(serializers.ModelSerializer[Faq]):
    class Meta:
        model = Faq
        fields = "__all__"


class ImageSerializer(serializers.ModelSerializer[Image]):
    class Meta:
        model = Image
        fields = ["id", "file_location", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        image_extensions = [".jpg", ".jpeg", ".png"]
        img_format = ""

        try:
            with PilImage.open(data["file_location"]) as img:
                img.verify()
                img_format = img.format.lower()
        except Exception as e:
            raise serializers.ValidationError(
                _("The image is not valid."), code="corrupted_file"
            ) from e

        if img_format not in image_extensions:
            raise serializers.ValidationError(
                _("The image must be in jpg, jpeg or png format."),
                code="invalid_extension",
            )

        return data


class LocationSerializer(serializers.ModelSerializer[Location]):
    class Meta:
        model = Location
        fields = "__all__"


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    class Meta:
        model = Resource
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer[Role]):
    class Meta:
        model = Role
        fields = "__all__"


class SocialLinkSerializer(serializers.ModelSerializer[SocialLink]):
    class Meta:
        model = SocialLink
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer[Tag]):
    class Meta:
        model = Tag
        fields = "__all__"


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
        if data["active"] is True and data.get("deprecation_date") is not None:
            raise serializers.ValidationError(
                _("Active topics cannot have a deprecation date."),
                code="active_topic_with_deprecation_error",
            )

        if data["active"] is False and data.get("deprecation_date") is None:
            raise serializers.ValidationError(
                _("Deprecated topics must have a deprecation date."),
                code="inactive_topic_no_deprecation_error",
            )

        validate_creation_and_deprecation_dates(data)

        return data


# MARK: Bridge Tables


class DiscussionEntrySerializer(serializers.ModelSerializer[DiscussionEntry]):
    class Meta:
        model = DiscussionEntry
        fields = "__all__"


class DiscussionTagSerializer(serializers.ModelSerializer[DiscussionTag]):
    class Meta:
        model = DiscussionTag
        fields = "__all__"


class ResourceTagSerializer(serializers.ModelSerializer[ResourceTag]):
    class Meta:
        model = ResourceTag
        fields = "__all__"


class ResourceTopicSerializer(serializers.ModelSerializer[ResourceTopic]):
    class Meta:
        model = ResourceTopic
        fields = "__all__"


class TaskTagSerializer(serializers.ModelSerializer[TaskTag]):
    class Meta:
        model = TaskTag
        fields = "__all__"


class TopicFormatSerializer(serializers.ModelSerializer[TopicFormat]):
    class Meta:
        model = TopicFormat
        fields = "__all__"
