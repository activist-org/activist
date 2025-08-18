# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the content app.
"""

import logging
from io import BytesIO
from typing import Any, Dict, Optional, Union

import requests
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, UploadedFile
from PIL import Image as PILImage
from rest_framework import serializers
from rest_framework.request import Request

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

# Note: The 'utils.malware_scanner' import was removed because your validate
# method currently uses 'requests.post' to an external microservice.
# If you genuinely intend to use a local scanning function, you must:
# 1. Ensure 'backend/utils/malware_scanner.py' exists and is correctly placed.
# 2. Uncomment the import: 'from utils.malware_scanner import scan_file_in_memory'
# 3. Call 'scan_file_in_memory(uploaded_file)' instead of 'requests.post(...)'.

logger = logging.getLogger(__name__)

# MARK: Main Tables


class DiscussionSerializer(serializers.ModelSerializer[Discussion]):
    class Meta:
        model = Discussion
<<<<<<< Malware_Scanning
        fields = "__all__"
=======
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
>>>>>>> main


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
            file=output,
            field_name=image_file.field_name,
            name=image_file.name,
            content_type=f"image/{output_format.lower()}",
            size=output.getbuffer().nbytes,
            charset=image_file.charset,
        )

<<<<<<< Malware_Scanning
    except Exception:
        logger.exception("Error scrubbing EXIF metadata.")
        return image_file
=======
    except Exception as e:
        logger.exception(f"Error scrubbing EXIF: {e}")

        return image_file  # return original file in case of error
>>>>>>> main


class ImageSerializer(serializers.ModelSerializer[Image]):
    class Meta:
        model = Image
        fields = ["id", "file_object", "creation_date"]
        read_only_fields = ["id", "creation_date"]

    def validate(self, data: Dict[str, UploadedFile]) -> Dict[str, UploadedFile]:
        if "file_object" not in data:
            raise serializers.ValidationError("No file was submitted.")

<<<<<<< Malware_Scanning
        uploaded_file = data["file_object"]

        # Ensure settings are configured. Mypy will complain if these aren't present.
        # It's crucial these are in your Django settings.py.
        if not hasattr(settings, 'IMAGE_UPLOAD_MAX_FILE_SIZE'):
            raise serializers.ValidationError("IMAGE_UPLOAD_MAX_FILE_SIZE is not configured in settings.")
        if uploaded_file.size is not None and uploaded_file.size > settings.IMAGE_UPLOAD_MAX_FILE_SIZE:
=======
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
>>>>>>> main
            raise serializers.ValidationError(
                f"The file size ({uploaded_file.size} bytes) is too large. "
                f"Maximum allowed: {settings.IMAGE_UPLOAD_MAX_FILE_SIZE} bytes."
            )

<<<<<<< Malware_Scanning
        logger.info("Sending file to filescan microservice...")
=======
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
        entity = request.data.get("entity_type")
        entity_id = request.data.get("entity_id")
        for file_obj in files:
            file_data = validated_data.copy()
            file_data["file_object"] = scrub_exif(file_obj)
            image = super().create(file_data)
            images.append(image)
            logger.info(f"Created Image instance with ID {image.id}")

            if request.data.get("entity_type") == "organization":
                next_index = OrganizationImage.objects.filter(org_id=entity_id).count()
                OrganizationImage.objects.create(
                    org_id=entity_id, image=image, sequence_index=next_index
                )
                logger.info(
                    f"Added image {image.id} to organization {entity_id} carousel at index {next_index}"
                )

            if entity == "group":
                logger.warning("ENTITY:", request.data.get("entity_type"))
                logger.warning("GROUP-CAROUSEL group_id:", entity_id)
            #       next_index = GroupImage.objects.filter(
            #           group_id=group_id
            #       ).count()
            #       GroupImage.objects.create(
            #           group_id=group_id, image=image, sequence_index=next_index
            #       )

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
>>>>>>> main

        try:
            # Ensure FILESCAN_SERVICE_URL is defined in your settings.py.
            if not hasattr(settings, 'FILESCAN_SERVICE_URL'):
                raise serializers.ValidationError("FILESCAN_SERVICE_URL is not configured in settings.")

            scan_response = requests.post(
                settings.FILESCAN_SERVICE_URL,
                files={"file": uploaded_file},
                timeout=10
            )
            scan_result = scan_response.json()
        except requests.exceptions.RequestException:
            logger.exception("Failed to scan file via microservice due to network/request error.")
            raise serializers.ValidationError("Could not scan the file. Try again later.")
        except Exception:
            logger.exception("Failed to scan file via microservice due to an unexpected error.")
            raise serializers.ValidationError("An unexpected error occurred during file scanning. Try again later.")


        status_result = scan_result.get("status", "")
        if status_result != "OK":
            raise serializers.ValidationError(
                f"Malware scan failed: {scan_result.get('message', 'Unknown error')}"
            )

        uploaded_file.seek(0)
        return data

    def create(self, validated_data: Dict[str, Any]) -> Image:
        request: Optional[Request] = self.context.get("request")

        if request and request.FILES and (file_obj := request.FILES.get("file_object")):
            validated_data["file_object"] = scrub_exif(file_obj)

        image: Image = super().create(validated_data)

        if request and request.data and (organization_id := request.data.get("organization_id")):
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

    def validate(self, data: Dict[str, Union[str, int, bool, Any]]) -> Dict[str, Union[str, int, bool, Any]]:
        active = data.get("active")
        deprecation_date = data.get("deprecation_date")

        if active is True and deprecation_date is not None:
            raise serializers.ValidationError(
                ("Active topics cannot have a deprecation date."),
                code="active_topic_with_deprecation_error",
            )

        if active is False and deprecation_date is None:
            raise serializers.ValidationError(
                ("Deprecated topics must have a deprecation date."),
                code="inactive_topic_no_deprecation_error",
            )

        validate_creation_and_deprecation_dates(data)

        return data
<<<<<<< Malware_Scanning


# MARK: Bridge Tables


class DiscussionEntrySerializer(serializers.ModelSerializer[DiscussionEntry]):
    class Meta:
        model = DiscussionEntry
        fields = "__all__"
=======
>>>>>>> main
