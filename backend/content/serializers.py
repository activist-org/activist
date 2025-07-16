# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the content app.
"""

from io import BytesIO
from typing import Any, Dict, Union

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile
from django.utils.translation import gettext as _
from PIL import Image as PILImage
from rest_framework import serializers

import requests
from django.conf import settings


from communities.organizations.models import OrganizationImage
from content.models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
    Topic,
)

from utils.malware_scanner import scan_file_in_memory
from utils.utils import validate_creation_and_deprecation_dates
import logging

logger = logging.getLogger(__name__)

# MARK: Main Tables


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    class Meta:
        model = Discussion
        fields = "__all__"


class FaqSerializer(serializers.ModelSerializer[Faq]):
    class Meta:
        model = Faq
        fields = "__all__"


# MARK: Clear Metadata


def scrub_exif(image_file: InMemoryUploadedFile) -> InMemoryUploadedFile:
    """
    Remove EXIF metadata from JPEGs and text metadata from PNGs.
    """
    try:
        img: PILImage.Image = PILImage.open(image_file)
        output_format = img.format

        if output_format == "JPEG":
            img = img.convert("RGB")

        elif output_format == "PNG":
            img = img.copy()
            img.info = {}

        else:
            return image_file  # return as-is if it's not JPEG or PNG

        # Save the cleaned image into a buffer.
        output = BytesIO()
        img.save(
            output,
            format=output_format,
            quality=95 if output_format == "JPEG" else None,  # set JPEG quality
            optimize=output_format == "JPEG",  # optimize JPEG
        )
        output.seek(0)

        # Return a new InMemoryUploadedFile
        return InMemoryUploadedFile(
            output,
            image_file.field_name,  # use original field name
            image_file.name,
            f"image/{output_format.lower()}",
            output.getbuffer().nbytes,
            image_file.charset,  # preserve charset (if applicable)
        )

    except Exception as e:
        print(f"Error scrubbing EXIF: {e}")
        return image_file  # return original file in case of error


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ["id", "file_object", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, UploadedFile]) -> Dict[str, UploadedFile]:
        if "file_object" not in data:
            raise serializers.ValidationError("No file was submitted.")

        uploaded_file = data["file_object"]

        if uploaded_file.size is not None and uploaded_file.size > settings.IMAGE_UPLOAD_MAX_FILE_SIZE:
            raise serializers.ValidationError(
                f"The file size ({uploaded_file.size} bytes) is too large. "
                f"Maximum allowed: {settings.IMAGE_UPLOAD_MAX_FILE_SIZE} bytes."
            )

        logger.info("Sending file to filescan microservice...")

        try:
            scan_response = requests.post(
                settings.FILESCAN_SERVICE_URL,
                files={"file": uploaded_file},
                timeout=10
            )
            scan_result = scan_response.json()
        except Exception as e:
            logger.exception("Failed to scan file via microservice.")
            raise serializers.ValidationError("Could not scan the file. Try again later.")

        status_result = scan_result.get("status", "")
        if status_result != "OK":
            raise serializers.ValidationError(
                f"Malware scan failed: {scan_result.get('message', 'Unknown error')}"
            )

        uploaded_file.seek(0)  # Important: reset file pointer
        return data
    def create(self, validated_data: Dict[str, Any]) -> Image:
        request = self.context.get("request")

        if file_obj := request.FILES.get("file_object"):
            validated_data["file_object"] = scrub_exif(file_obj)

        # Save the image
        image = super().create(validated_data)

        # Optional: add to organization images if provided
        if organization_id := request.data.get("organization_id"):
            next_index = OrganizationImage.objects.filter(
                org_id=organization_id
            ).count()
            OrganizationImage.objects.create(
                org_id=organization_id, image=image, sequence_index=next_index
            )

        logger.info(f"Image saved successfully with ID: {image.id}")
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
