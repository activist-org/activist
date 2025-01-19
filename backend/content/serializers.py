# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the content app.
"""

from typing import Dict, Union

from django.utils.translation import gettext as _
from PIL import Image as PilImage
from rest_framework import serializers

from content.models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
    SocialLink,
    Topic,
)
from utils.utils import validate_creation_and_deprecation_dates

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

        file_location = data["file_location"]
        if isinstance(file_location, str):
            try:
                with PilImage.open(file_location) as img:
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

        else:
            raise serializers.ValidationError(
                _("The file location must be a string."), code="invalid_file_location"
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


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "link", "label", "order"]


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
