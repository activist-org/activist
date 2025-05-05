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


class ImageSerializer(serializers.ModelSerializer[Image]):
    class Meta:
        model = Image
        fields = ["id", "file_object", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, UploadedFile]) -> Dict[str, UploadedFile]:
        if "file_object" not in data:
            raise serializers.ValidationError("No file was submitted.")

        # DATA_UPLOAD_MAX_MEMORY_SIZE and IMAGE_UPLOAD_MAX_FILE_SIZE are set in core/settings.py.
        # The file size limit is not being enforced. We're checking the file size here.
        if (
            data["file_object"].size is not None
            and data["file_object"].size > settings.IMAGE_UPLOAD_MAX_FILE_SIZE
        ):
            raise serializers.ValidationError(
                f"The file size ({data['file_object'].size} bytes) is too large. The maximum file size is {settings.IMAGE_UPLOAD_MAX_FILE_SIZE} bytes."
            )

        # Malware scanning integration
        uploaded_file = data["file_object"]
        file_content = uploaded_file.read()
        logger.info("About to scan uploaded file in memory.")  # Add this log
        scan_result = scan_file_in_memory(file_content)
        logger.info(f"Scan result: {scan_result}")  # Add this log
        uploaded_file.seek(0)  # Reset the file pointer after reading

        if scan_result:
            raise serializers.ValidationError(f"Malware detected in the uploaded file: {scan_result}")

        return data

    def create(self, validated_data: Dict[str, Any]) -> Image:
        request = self.context["request"]

        if file_obj := request.FILES.get("file_object"):
            validated_data["file_object"] = scrub_exif(file_obj)

        logger.info("Creating a new Image object.")  # Add this log
        image = super().create(validated_data)
        logger.info(f"Image object created with ID: {image.id}") # Add this log

        return data

    # Using 'Any' type until a more correct type is determined.
    def create(self, validated_data: Dict[str, Any]) -> Image:
        request = self.context["request"]

        if file_obj := request.FILES.get("file_object"):
            validated_data["file_object"] = scrub_exif(file_obj)

        # Create the image instance.
        image = super().create(validated_data)

        # Handle organization image indexing if applicable.
        if organization_id := request.data.get("organization_id"):
            next_index = OrganizationImage.objects.filter(
                org_id=organization_id
            ).count()
            OrganizationImage.objects.create(
                org_id=organization_id, image=image, sequence_index=next_index
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
