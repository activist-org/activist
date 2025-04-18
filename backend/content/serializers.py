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
from utils.utils import validate_creation_and_deprecation_dates

# MARK: Main Tables


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    """
    Serializer for Discussion model data.
    """

    class Meta:
        model = Discussion
        fields = "__all__"


class FaqSerializer(serializers.ModelSerializer[Faq]):
    """
    Serializer for Faq model data.
    """

    class Meta:
        model = Faq
        fields = "__all__"


# MARK: Clear Metadata


def scrub_exif(image_file: InMemoryUploadedFile) -> InMemoryUploadedFile:
    """
    Remove EXIF metadata from JPEGs and text metadata from PNGs.

    This function helps protect user privacy by removing potentially
    sensitive metadata from uploaded image files.

    Parameters
    ----------
    image_file : InMemoryUploadedFile
        The uploaded image file to be processed.

    Returns
    -------
    InMemoryUploadedFile
        Processed image file with metadata removed.

    Notes
    -----
    For JPEG files, the function converts to RGB and removes EXIF data.
    For PNG files, it clears the metadata info dictionary.
    Other file types are returned unchanged.
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
    """
    Serializer for Image model data.
    """

    class Meta:
        model = Image
        fields = ["id", "file_object", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, UploadedFile]) -> Dict[str, UploadedFile]:
        """
        Validate uploaded image files.

        Parameters
        ----------
        data : Dict[str, UploadedFile]
            Dictionary containing the file_object.

        Returns
        -------
        Dict[str, UploadedFile]
            Validated data dictionary.

        Raises
        ------
        ValidationError
            If no file was submitted or if the file size exceeds the maximum limit.
        """
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

        return data

    def create(self, validated_data: Dict[str, Any]) -> Image:
        """
        Create an Image instance with privacy-enhanced processing.

        Parameters
        ----------
        validated_data : Dict[str, Any]
            Dictionary containing validated data for creating the image.

        Returns
        -------
        Image
            Created Image instance.

        Notes
        -----
        This method:
        1. Processes the uploaded file to remove metadata
        2. Creates the image record
        3. Links the image to an organization if specified
        """
        request = self.context["request"]

        if file_obj := request.FILES.get("file_object"):
            validated_data["file_object"] = scrub_exif(file_obj)

        # Create the image instance.
        image = super().create(validated_data)

        # Handle organization image indexing if applicable.
        if organization_id := request.data.get("organization_id"):
            # if request.data.get("entity") == "organization-icon":

            #  elif request.data.get("entity") == "organization-carousel":
            next_index = OrganizationImage.objects.filter(
                org_id=organization_id
            ).count()
            OrganizationImage.objects.create(
                org_id=organization_id, image=image, sequence_index=next_index
            )

        # if group_id := request.data.get("group_id"):
        #     if request.data.get("entity") == "group-icon":
        #         group = Group.objects.get(id=group_id)
        #         group.iconUrl = image.file_object.url
        #         group.save()
        #     elif request.data.get("entity") == "group-carousel":
        #       next_index = GroupImage.objects.filter(
        #           group_id=group_id
        #       ).count()
        #       GroupImage.objects.create(
        #           group_id=group_id, image=image, sequence_index=next_index
        #       )

        # if event_id := request.data.get("event_id"):
        #     if request.data.get("entity") == "event-icon":
        #     event = Event.objects.get(id=event_id)
        #     event.iconUrl = image.file_object.url # use icon image uuid
        #     event.save()
        #     elif request.data.get("entity") == "event-carousel":
        #       return ({"message": "Event carousel not implemented yet."})

        return image


class LocationSerializer(serializers.ModelSerializer[Location]):
    """
    Serializer for Location model data.
    """

    class Meta:
        model = Location
        fields = "__all__"


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    """
    Serializer for Resource model data.
    """

    class Meta:
        model = Resource
        fields = "__all__"


class TopicSerializer(serializers.ModelSerializer[Topic]):
    """
    Serializer for Topic model data.
    """

    class Meta:
        model = Topic
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        """
        Validate topic data including active status and deprecation date.

        Parameters
        ----------
        data : Dict[str, Union[str, int]]
            Topic data dictionary to validate.

        Returns
        -------
        Dict[str, Union[str, int]]
            Validated data dictionary.

        Raises
        ------
        ValidationError
            If an active topic has a deprecation date or
            an inactive topic doesn't have a deprecation date.
        """
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
    """
    Serializer for DiscussionEntry model data.
    """

    class Meta:
        model = DiscussionEntry
        fields = "__all__"
