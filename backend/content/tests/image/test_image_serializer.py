import io
import logging
from datetime import timedelta
from unittest.mock import patch
from uuid import uuid4

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from PIL import Image as TestImage
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization
from content.factories import EntityLocationFactory
from content.serializers import ImageIconSerializer, ImageSerializer
from events.models import Event

MEDIA_ROOT = settings.MEDIA_ROOT  # ensure this points to the images folder


@pytest.mark.django_db
def test_image_serializer_missing_entity_type() -> None:
    """
    Ensure serializer raises ValidationError when entity_type is missing.
    """
    fake_file = SimpleUploadedFile(
        "test.png", b"file_content", content_type="image/png"
    )
    request = type("Request", (), {"data": {"entity_id": "123"}})()
    serializer = ImageSerializer(context={"request": request})
    with pytest.raises(ValidationError, match="No entity was specified"):
        serializer.validate({"file_object": fake_file})


@pytest.mark.django_db
def test_image_serializer_missing_entity_id() -> None:
    """
    Ensure serializer raises ValidationError when entity_id is missing.
    """
    fake_file = SimpleUploadedFile(
        "test.png", b"file_content", content_type="image/png"
    )
    request = type("Request", (), {"data": {"entity_type": "group"}})()
    serializer = ImageSerializer(context={"request": request})
    with pytest.raises(ValidationError, match="No entity_id was specified"):
        serializer.validate({"file_object": fake_file})


# MARK:  Icon Tests


@pytest.mark.django_db
def test_image_icon_serializer_validate_missing_file():
    """
    Test validate method raises error when file_object is missing.
    """
    request = type("Request", (), {"data": {"entity_type": "org", "entity_id": "1"}})()
    serializer = ImageIconSerializer(context={"request": request})
    with pytest.raises(serializers.ValidationError, match="No file was submitted."):
        serializer.validate({})


@pytest.mark.django_db
def test_image_icon_serializer_validate_missing_entity_type():
    """
    Test validate method raises error when entity_type is missing.
    """
    file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
    request = type("Request", (), {"data": {"entity_id": "1"}})()
    serializer = ImageIconSerializer(context={"request": request})
    with pytest.raises(
        serializers.ValidationError, match="No entity was specified for the image."
    ):
        serializer.validate({"file_object": file})


@pytest.mark.django_db
def test_image_icon_serializer_validate_missing_entity_id():
    """
    Test validate method raises error when entity_id is missing.
    """
    file = SimpleUploadedFile("test.jpg", b"file_content", content_type="image/jpeg")
    request = type("Request", (), {"data": {"entity_type": "org"}})()
    serializer = ImageIconSerializer(context={"request": request})
    with pytest.raises(
        serializers.ValidationError, match="No entity_id was specified for the image."
    ):
        serializer.validate({"file_object": file})


@pytest.mark.django_db
def test_image_icon_serializer_validate_file_too_large():
    """
    Test validate method raises error for oversized files.
    """
    # Create file larger than max size
    large_file = SimpleUploadedFile(
        "large.jpg",
        b"0" * (settings.IMAGE_UPLOAD_MAX_FILE_SIZE + 1),
        content_type="image/jpeg",
    )
    request = type("Request", (), {"data": {"entity_type": "org", "entity_id": "1"}})()
    serializer = ImageIconSerializer(context={"request": request})

    with pytest.raises(serializers.ValidationError) as excinfo:
        serializer.validate({"file_object": large_file})

    assert (
        f"too large. The maximum file size is {settings.IMAGE_UPLOAD_MAX_FILE_SIZE}"
        in str(excinfo.value)
    )


@pytest.mark.django_db
def test_image_icon_serializer_create_organization(caplog):
    """
    Test create method links image to organization.
    """
    # Set log level to INFO to capture the expected log messages
    caplog.set_level(logging.INFO)

    org = OrganizationFactory()

    # Create a valid image using PIL
    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)
    file = SimpleUploadedFile(
        "test.jpg", img_file.getvalue(), content_type="image/jpeg"
    )

    request = type(
        "Request",
        (),
        {
            "data": {"entity_type": "organization", "entity_id": str(org.id)},
            "FILES": {"file_object": file},
        },
    )()

    serializer = ImageIconSerializer(context={"request": request})
    image = serializer.create({"file_object": file})

    org.refresh_from_db()
    assert org.icon_url == image

    # Check if the expected log message exists in any log record
    assert any("Updated Organization" in record.message for record in caplog.records)
    # Alternative check if the message format is different
    assert any(
        f"Updated Organization {org.id} with icon {image.id}" in record.message
        for record in caplog.records
    )


@pytest.mark.django_db
def test_image_icon_serializer_create_event(caplog):
    """
    Test create method links image to event.
    """
    # Set log level to INFO
    caplog.set_level(logging.INFO)

    # Create required entities
    user = UserFactory()
    org = OrganizationFactory()
    # Create a location - this was missing before
    location = EntityLocationFactory()  # Use the factory mentioned in the warnings

    # Create event with ALL required fields
    event = Event.objects.create(
        name="Test Event",
        start_time=timezone.now(),
        end_time=timezone.now() + timedelta(hours=1),
        created_by=user,
        orgs=org,
        offline_location=location,  # Associate with location
    )

    # Create a valid image
    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)
    file = SimpleUploadedFile(
        "test.jpg", img_file.getvalue(), content_type="image/jpeg"
    )

    request = type(
        "Request",
        (),
        {
            "data": {"entity_type": "event", "entity_id": str(event.id)},
            "FILES": {"file_object": file},
        },
    )()

    serializer = ImageIconSerializer(context={"request": request})
    image = serializer.create({"file_object": file})

    event.refresh_from_db()
    assert event.icon_url == image

    # Check log message using the proper approach
    assert any("Updated Event" in record.message for record in caplog.records)


@pytest.mark.django_db
def test_image_icon_serializer_create_unknown_entity():
    """
    Test create method ignores unknown entity types.
    """
    file = SimpleUploadedFile("test.jpg", b"content", content_type="image/jpeg")
    request = type(
        "Request",
        (),
        {
            "data": {"entity_type": "user", "entity_id": "123"},
            "FILES": {"file_object": file},
        },
    )()

    serializer = ImageIconSerializer(context={"request": request})
    image = serializer.create({"file_object": file})

    # Verify no entity was updated
    assert not Organization.objects.filter(icon_url=image).exists()
    assert not Event.objects.filter(icon_url=image).exists()


@pytest.mark.django_db
def test_image_icon_serializer_create_organization_not_found():
    """
    Test create method handles non-existent organization.
    """
    non_existent_id = uuid4()
    file = SimpleUploadedFile("test.jpg", b"content", content_type="image/jpeg")
    request = type(
        "Request",
        (),
        {
            "data": {"entity_type": "organization", "entity_id": str(non_existent_id)},
            "FILES": {"file_object": file},
        },
    )()

    serializer = ImageIconSerializer(context={"request": request})
    with pytest.raises(
        serializers.ValidationError, match="An unexpected error occurred"
    ):
        serializer.create({"file_object": file})


@pytest.mark.django_db
def test_image_icon_serializer_create_organization_save_failure(caplog):
    """
    Test create method handles organization save failures.
    """
    org = OrganizationFactory()
    file = SimpleUploadedFile("test.jpg", b"content", content_type="image/jpeg")

    request = type(
        "Request",
        (),
        {
            "data": {"entity_type": "organization", "entity_id": str(org.id)},
            "FILES": {"file_object": file},
        },
    )()

    # Mock save to fail
    with patch.object(Organization, "save", side_effect=Exception("DB Error")):
        serializer = ImageIconSerializer(context={"request": request})
        with pytest.raises(
            serializers.ValidationError, match="An unexpected error occurred"
        ):
            serializer.create({"file_object": file})

        assert (
            "An unexpected error occurred while updating the organization"
            in caplog.text
        )
