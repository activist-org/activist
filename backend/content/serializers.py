# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the content app.
"""

import logging
from io import BytesIO
from typing import Any, Dict, Union

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile
from PIL import Image as PILImage
from rest_framework import serializers

from communities.groups.models import GroupImage
from communities.organizations.models import Organization, OrganizationImage
from content.models import (
    Discussion,
    DiscussionEntry,
    Faq,
    Image,
    Location,
    Resource,
    ResourceFlag,
    Topic,
)
from events.models import Event
from utils.utils import validate_creation_and_deprecation_dates

logger = logging.getLogger(__name__)

# MARK: Discussion


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    """
    Serializer for Discussion model data.
    """

    class Meta:
        model = Discussion
        exclude = "created_by", "deletion_date"


# MARK: Discussion Entry


class DiscussionEntrySerializer(serializers.ModelSerializer[DiscussionEntry]):
    """
    Serializer for DiscussionEntry model data.
    """

    class Meta:
        model = DiscussionEntry
        exclude = "created_by", "deletion_date"


# MARK: FAQ


class FaqSerializer(serializers.ModelSerializer[Faq]):
    """
    Serializer for Faq model data.
    """

    class Meta:
        model = Faq
        fields = "__all__"


# MARK: Image


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

    Raises
    ------
    serializers.ValidationError
        If the file is invalid, corrupted, exceeds size limits, or has dangerous dimensions.

    Notes
    -----
    For JPEG files, the function converts to RGB and removes EXIF data.
    For PNG files, it clears the metadata info dictionary.
    Only JPEG, PNG, and WEBP formats are supported.

    Security Features:
    - Validates file size before processing
    - Checks image format against allowlist
    - Prevents decompression bomb attacks
    - Handles PIL exceptions specifically
    """
    # Constants
    MAX_FILE_SIZE = getattr(
        settings, "IMAGE_UPLOAD_MAX_FILE_SIZE", 5 * 1024 * 1024
    )  # 5MB default
    MAX_PIXELS = 178956970  # ~178 megapixels (PIL default limit)
    ALLOWED_FORMATS = ["JPEG", "PNG", "WEBP"]

    # Validate file size before processing
    if image_file.size is None:
        logger.warning("Image file has no size attribute")
        raise serializers.ValidationError(
            "Invalid image file: unable to determine file size."
        )

    if image_file.size > MAX_FILE_SIZE:
        logger.warning(
            f"Image file size {image_file.size} exceeds maximum {MAX_FILE_SIZE}"
        )
        raise serializers.ValidationError(
            f"File size ({image_file.size} bytes) exceeds maximum allowed size ({MAX_FILE_SIZE} bytes)."
        )

    # Validate file is actually an image
    try:
        img: PILImage.Image = PILImage.open(image_file)
        img.verify()  # Verify it's actually an image

        # Re-open after verify (verify() closes the file)
        image_file.seek(0)
        img = PILImage.open(image_file)

    except PILImage.UnidentifiedImageError as e:
        logger.warning(f"Unidentified image format for file: {image_file.name}")
        raise serializers.ValidationError(
            "Invalid or corrupted image file. Please upload a valid JPEG, PNG, or WEBP image."
        ) from e

    except PILImage.DecompressionBombError as e:
        logger.warning(f"Decompression bomb detected for file: {image_file.name}")
        raise serializers.ValidationError(
            "Image dimensions are too large. This could be a decompression bomb attack."
        ) from e

    except Exception as e:
        logger.exception(f"Error opening image file {image_file.name}: {e}")
        raise serializers.ValidationError(
            "Failed to process image file. The file may be corrupted."
        ) from e

    # Validate image format against allowlist
    output_format = img.format
    if output_format not in ALLOWED_FORMATS:
        logger.warning(
            f"Unsupported image format '{output_format}' for file: {image_file.name}"
        )
        raise serializers.ValidationError(
            f"Unsupported image format: {output_format}. Only JPEG, PNG, and WEBP are allowed."
        )

    # Check for decompression bomb (extremely large dimensions)
    try:
        width, height = img.size
        if width * height > MAX_PIXELS:
            logger.warning(
                f"Image dimensions {width}x{height} exceed safety limit for file: {image_file.name}"
            )
            raise serializers.ValidationError(
                f"Image dimensions ({width}x{height}) are too large. Maximum total pixels: {MAX_PIXELS}."
            )
    except AttributeError as e:
        logger.error(f"Unable to determine image dimensions for file: {image_file.name}")
        raise serializers.ValidationError(
            "Unable to determine image dimensions."
        ) from e

    # Process the image to remove metadata
    try:
        if output_format == "JPEG":
            # Convert to RGB to strip EXIF
            img = img.convert("RGB")

        elif output_format == "PNG":
            # Copy and clear metadata
            img = img.copy()
            img.info = {}

        elif output_format == "WEBP":
            # WEBP support - copy without metadata
            img = img.copy()

        # Save the cleaned image into a buffer
        output = BytesIO()
        
        # Set quality parameter based on format
        save_kwargs = {"format": output_format}
        if output_format in ["JPEG", "WEBP"]:
            save_kwargs["quality"] = 95
        if output_format == "JPEG":
            save_kwargs["optimize"] = True
            
        img.save(output, **save_kwargs)
        output.seek(0)

        # Return a new InMemoryUploadedFile
        cleaned_file = InMemoryUploadedFile(
            output,
            image_file.field_name,
            image_file.name,
            f"image/{output_format.lower()}",
            output.getbuffer().nbytes,
            image_file.charset,
        )

        logger.info(f"Successfully scrubbed EXIF data from {image_file.name}")
        return cleaned_file

    except OSError as e:
        logger.error(f"OS error processing image {image_file.name}: {e}")
        raise serializers.ValidationError(
            "Failed to process image file due to system error."
        ) from e

    except MemoryError as e:
        logger.error(f"Memory error processing large image {image_file.name}: {e}")
        raise serializers.ValidationError(
            "Image file is too large to process in memory."
        ) from e

    except Exception as e:
        logger.exception(f"Unexpected error scrubbing EXIF from {image_file.name}: {e}")
        raise serializers.ValidationError(
            "An unexpected error occurred while processing the image."
        ) from e


# MARK: Image


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

        if "entity_type" not in self.context["request"].data:
            raise serializers.ValidationError("No entity was specified for the image.")

        if "entity_id" not in self.context["request"].data:
            raise serializers.ValidationError(
                "No entity_id was specified for the image."
            )

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

    def create(self, validated_data: Dict[str, Any]) -> Any:
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

        images = []

        files = request.FILES.getlist("file_object")
        sequences = request.data.getlist("sequences", [])
        entity_type = request.data.get("entity_type")
        entity_id = request.data.get("entity_id")
        index = 0
        for file_obj in files:
            file_data = validated_data.copy()
            file_data["file_object"] = scrub_exif(file_obj)
            image = super().create(file_data)
            images.append(image)
            logger.info(f"Created Image instance with ID {image.id}")

            if entity_type == "organization":
                sequence_index = sequences[index] if sequences else index
                OrganizationImage.objects.create(
                    org_id=entity_id, image=image, sequence_index=sequence_index
                )
                logger.info(
                    f"Added image {image.id} to organization {entity_id} carousel at index {index}"
                )

            if entity_type == "group":
                sequence_index = sequences[index] if sequences else index
                GroupImage.objects.create(
                    group_id=entity_id, image=image, sequence_index=sequence_index
                )
                logger.info(
                    f"Added image {image.id} to group {entity_id} carousel at index {index}"
                )
            index += 1
        return images


# MARK: Icon


class ImageIconSerializer(serializers.ModelSerializer[Image]):
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

        if "entity_type" not in self.context["request"].data:
            raise serializers.ValidationError("No entity was specified for the image.")

        if "entity_id" not in self.context["request"].data:
            raise serializers.ValidationError(
                "No entity_id was specified for the image."
            )

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

    def create(self, validated_data: Dict[str, Any]) -> Any:
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

        file_obj = request.FILES.get("file_object")
        entity = request.data.get("entity_type")
        entity_id = request.data.get("entity_id")
        if file_obj is None:
            raise serializers.ValidationError("No file was submitted.")

        file_data = validated_data.copy()
        file_data["file_object"] = scrub_exif(file_obj)
        image = super().create(file_data)
        logger.info(f"Created Image instance with ID {image.id}")

        if entity == "organization":
            try:
                organization = Organization.objects.get(id=entity_id)
                organization.icon_url = image
                organization.save()
                logger.info(f"Updated Organization {entity_id} with icon {image.id}")

            except Exception as e:
                logger.exception(
                    f"An unexpected error occurred while updating the organization: {str(e)}"
                )
                raise serializers.ValidationError(
                    f"An unexpected error occurred while updating the event: {str(e)}"
                ) from e

        if entity == "group":
            logger.warning("ENTITY:", request.data.get("entity_type"))
            logger.warning("GROUP-CAROUSEL group_id:", entity_id)
            #       next_index = GroupImage.objects.filter(
            #           group_id=group_id
            #       ).count()
            #       GroupImage.objects.create(
            #           group_id=group_id, image=image, sequence_index=next_index
            #       )

        if entity == "event":
            try:
                event = Event.objects.get(id=entity_id)
                event.icon_url = image
                event.save()
                logger.info(f"Updated Event {entity_id} with icon {image.id}")

            except Exception as e:
                logger.exception(
                    f"An unexpected error occurred while updating the event: {str(e)}"
                )
                raise serializers.ValidationError(
                    f"An unexpected error occurred while updating the event: {str(e)}"
                ) from e

        return image


# MARK: Location


class LocationSerializer(serializers.ModelSerializer[Location]):
    """
    Serializer for Location model data.
    """

    class Meta:
        model = Location
        fields = "__all__"


# MARK: Resource


class ResourceSerializer(serializers.ModelSerializer[Resource]):
    """
    Serializer for Resource model data.
    """

    class Meta:
        model = Resource
        fields = "__all__"


# MARK: Resource Flag


class ResourceFlagSerializer(serializers.ModelSerializer[ResourceFlag]):
    """
    Serializers for Resource Flag model.
    """

    class Meta:
        model = ResourceFlag
        fields = "__all__"


# MARK: Topic


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
                ("Active topics cannot have a deprecation date."),
                code="active_topic_with_deprecation_error",
            )

        if data["active"] is False and data.get("deprecation_date") is None:
            raise serializers.ValidationError(
                ("Deprecated topics must have a deprecation date."),
                code="inactive_topic_no_deprecation_error",
            )

        validate_creation_and_deprecation_dates(data=data)

        return data
