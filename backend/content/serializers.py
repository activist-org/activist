# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the content app.
"""

from typing import Dict, Union

from django.utils.translation import gettext as _
from rest_framework import serializers

from content.models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
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
        fields = ["id", "file_object", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        # Remove string validation since we're getting a file object
        if "file_object" not in data:
            raise serializers.ValidationError("No file was submitted.")
        return data

    def create(self, validated_data):
        # Handle file upload properly
        file_obj = self.context["request"].FILES.get("file_object")
        if file_obj:
            validated_data["file_object"] = file_obj
        
        # Create the image first
        image = super().create(validated_data)
        
        # Get the organization from the request
        organization_id = self.context['request'].data.get('organization_id')
        if organization_id:
            # Create OrganizationImage with next sequence index
            from communities.organizations.models import OrganizationImage
            next_index = OrganizationImage.objects.filter(org_id=organization_id).count()
            OrganizationImage.objects.create(
                org_id=organization_id,
                image=image,
                sequence_index=next_index
            )
        return image


class LocationSerializer(serializers.ModelSerializer[Location]):
    class Meta:
        model = Location
        fields = "__all__"


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    class Meta:
        model = Resource
        fields = "__all__"


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
