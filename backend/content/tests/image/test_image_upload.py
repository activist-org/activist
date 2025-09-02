# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for Image upload-related functionality.
"""

import io
import logging
import os
import uuid
from datetime import datetime, timedelta
from typing import Any, Dict, Generator
from unittest.mock import patch
from uuid import uuid4

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from PIL import Image as TestImage
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization
from content.factories import EntityLocationFactory, ImageFactory
from content.models import Image
from content.serializers import ImageIconSerializer, ImageSerializer
from events.models import Event

MEDIA_ROOT = settings.MEDIA_ROOT  # ensure this points to the images folder


@pytest.fixture
def image_with_file() -> Generator[Image, None, None]:
    """
    Fixture for creating an image with a file.
    Deletes the file after the test.
    """
    image = ImageFactory()

    yield image

    # Cleanup after the test.
    file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    if os.path.exists(file_path):
        os.remove(file_path)


def create_organization_and_image() -> Dict[str, Any]:
    """
    Helper function to create a test organization and a simple test image.
    """
    org = OrganizationFactory()
    assert org is not None, "Entity was not created"

    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)

    file = SimpleUploadedFile(
        "test_create_image.jpg", img_file.getvalue(), content_type="image/jpeg"
    )

    return {
        "entity_id": str(org.id),
        "entity_type": "organization",
        "file_object": file,
    }


@pytest.mark.django_db
def test_image_creation(image_with_file: Image) -> None:
    """
    Test the creation of an image with a file.
    This is like a Model test.
    """
    image = image_with_file

    file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)

    assert os.path.exists(file_path)
    assert image.id is not None
    assert image.file_object.name.endswith(".jpg")
    assert isinstance(image.creation_date, datetime)


@pytest.mark.django_db
def test_image_serializer(image_with_file: Image) -> None:
    """
    Test the serializer with a file.
    """
    image = image_with_file
    serializer = ImageSerializer(image)

    assert serializer.data["id"] == str(image.id)
    assert "file_object" in serializer.data
    assert "creation_date" in serializer.data

    file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    assert os.path.exists(file_path)


@pytest.mark.django_db
def test_image_serializer_missing_file() -> None:
    """
    Test the serializer with a missing file.
    """
    serializer = ImageSerializer(data={})
    assert not serializer.is_valid()
    assert "file_object" in serializer.errors


@pytest.mark.django_db
def test_image_serializer_missing_file_object() -> None:
    """
    Ensure serializer raises ValidationError when file_object is missing.
    """
    request = type(
        "Request", (), {"data": {"entity_type": "group", "entity_id": "123"}}
    )()
    serializer = ImageSerializer(context={"request": request})
    with pytest.raises(ValidationError, match="No file was submitted."):
        serializer.validate({})


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


@pytest.mark.django_db
def test_image_list_view(client: APIClient) -> None:
    """
    Test the list view for images.
    This is like a GET request.
    """
    images = ImageFactory.create_batch(3)
    filenames = [image.file_object.name for image in images]

    response = client.get("/v1/content/images")

    assert response.status_code == 200
    assert response.json()["count"] == 3

    for filename in filenames:
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        if os.path.exists(file_path):
            os.remove(file_path)


@pytest.mark.django_db
def test_image_create_single_file_view(client: APIClient) -> None:
    """
    Test the create view for images.
    This is like a POST request.

    1. Create an organization and a test image.
    2. Make a POST request to the image create endpoint with org info and image file.
    3. Check that the response is a 201 status code.
    4. Check that the image was inserted into the database.
    5. Check that the file was uploaded/saved to the media root.
    6. Check that the uploaded/saved file has a sanitized, UUID filename.
    8. Delete the file from the file system. This is for test cleanup and does not happen in production.
    """

    data = create_organization_and_image()

    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 201, (
        f"Expected status code 201, but got {response.status_code}."
    )
    assert Image.objects.count() == 1, (
        "Expected one image in the database, but found more than one."
    )

    # Assert file exists in filesystem.
    response_data = response.json()
    assert len(response_data) == 1, "Expected one image in response"
    file_url = response_data[0]["fileObject"]

    relative_path = file_url.replace("http://testserver/media/", "").lstrip("/")
    uploaded_file = os.path.join(settings.MEDIA_ROOT, relative_path)

    assert os.path.exists(uploaded_file), (
        f"File {uploaded_file} was not found in the filesystem"
    )

    uuid_filename = os.path.splitext(os.path.basename(uploaded_file))[0]

    try:
        uuid_obj = uuid.UUID(uuid_filename, version=4)
        assert str(uuid_obj) == uuid_filename

    except ValueError:
        assert False, f"Filename is not a valid UUID: {uuid_filename}"

    file_object = response_data[0]["fileObject"].split("/")[-1]
    file_to_delete = os.path.join(settings.MEDIA_ROOT, "images", file_object)

    if os.path.exists(file_to_delete):
        os.remove(file_to_delete)


@pytest.mark.django_db
def test_image_create_multiple_files_view(client: APIClient) -> None:
    """
    Test the create view for multiple images.
    This is like a POST request.

    1. Create 3 images.
    2. Create an organization.
    3. Make a POST request to the image create endpoint with org info and image files.
    4. Check that the response is a 201 status code.
    5. Check that the images were inserted into the database.
    6. Check that the files were uploaded/saved to the media root.
    7. Delete the files from the file system. This is for test cleanup and does not happen in production.
    """

    org = OrganizationFactory()
    files = []

    # Create multiple test files.
    files = []
    for i in range(3):
        img = TestImage.new("RGB", (100, 100), color="red")
        img_file = io.BytesIO()
        img.save(img_file, format="JPEG")
        img_file.seek(0)

        file = SimpleUploadedFile(
            f"test_image_{i}.jpg", img_file.getvalue(), content_type="image/jpeg"
        )
        files.append(file)

    data = {
        "entity_id": str(org.id),
        "entity_type": "organization",
        "file_object": files,
    }

    response = client.post("/v1/content/images", data, format="multipart")

    # Assert that the response is a 201 status code.
    assert response.status_code == 201

    # Assert that the images were inserted into the database.
    assert Image.objects.count() == 3

    # Assert that the files were uploaded/saved to the media root.
    for image in Image.objects.all():
        file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
        assert os.path.exists(file_path), (
            f"File {file_path} was not found in the filesystem"
        )

    # Cleanup all test files.
    for image in Image.objects.all():
        file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
        if os.path.exists(file_path):
            os.remove(file_path)


@pytest.mark.django_db
def test_image_create_missing_file(client: APIClient) -> None:
    """
    Test the create view for images with a missing file.
    Test can return 'WARNING ... Bad Request: /v1/content/images/'. This is expected.
    """

    org = OrganizationFactory()
    data = {"organization_id": str(org.id)}  # no file_object provided
    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 400
    assert "fileObject" in response.json()
    assert "No file was submitted." in response.json()["fileObject"]


@pytest.mark.django_db
def test_image_create_corrupted_file(client: APIClient) -> None:
    """
    Test the create view for images with a corrupted file.
    The validation is likely happening in the model, not the serializer.
    Test can return 'WARNING ... Bad Request: /v1/content/images/'. This is expected.
    """

    org = OrganizationFactory()
    assert org is not None, "Organization was not created"

    # Open a valid image file, take the first few bytes, then corrupt the rest.
    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    # Take the first 100 bytes.
    corrupted_img = img_file.getvalue()[:100]
    # Add some corrupt data after.
    corrupted_img += b"corrupteddata"
    # Wrap the corrupted image data in a SimpleUploadedFile.
    file = SimpleUploadedFile(
        "corrupted_image.jpg", corrupted_img, content_type="image/jpeg"
    )

    data = {"organization_id": str(org.id), "file_object": file}

    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 400
    assert (
        "Upload a valid image. The file you uploaded was either not an image or a corrupted image."
        in response.json()["fileObject"]
    )


@pytest.mark.django_db
def test_image_create_large_file(client: APIClient) -> None:
    """
    Test the create view for images with a large file.
    Test can return 'WARNING ... Bad Request: /v1/content/images/'. This is expected.
    """
    org = OrganizationFactory()
    assert org is not None, "Organization was not created"

    # TestImage comes from the PIL import, above.
    img = TestImage.new("RGB", (3000, 3000), color="red")

    img_file = io.BytesIO()
    # BMP is uncompressed = easy to create a large image file size.
    img.save(img_file, format="BMP")
    img_file.seek(0)

    file = SimpleUploadedFile(
        "large_image.bmp", img_file.getvalue(), content_type="image/bmp"
    )

    data = {
        "entity_id": str(org.id),
        "entity_type": "organization",
        "file_object": file,
    }

    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 400

    # DATA_UPLOAD_MAX_MEMORY_SIZE and IMAGE_UPLOAD_MAX_FILE_SIZE are set in core/settings.py.
    # The file size limit is not being enforced. We're checking the file size in the serializer validation.
    assert (
        f"The file size ({file.size} bytes) is too large. The maximum file size is {settings.IMAGE_UPLOAD_MAX_FILE_SIZE} bytes."
        in response.json()["nonFieldErrors"]
    )


@pytest.mark.django_db
def test_image_destroy_view(client: APIClient) -> None:
    """
    Test the destroy/delete view for an existing image.

    The default DRF destroy() method in the view is used (there is no written 'destroy' method in the view).
    A signal to delete the file from the filesystem is triggered when the Image instance is deleted.
    The signal is triggered in the Image model.

    This is like a DELETE request.

    1. Create an org and image and upload the org/image as 'data'.
    2. Delete the image from the database and the file from the file system.
    """

    data = create_organization_and_image()

    response = client.post("/v1/content/images", data, format="multipart")
    response_data = response.json()
    assert len(response_data) == 1, "Expected one image in response"

    file_id = response_data[0]["id"]

    # Assert file exists in filesystem and the database.
    file_url = response_data[0]["fileObject"]
    relative_path = file_url.replace("http://testserver/media/", "").lstrip("/")
    uploaded_file = os.path.join(settings.MEDIA_ROOT, relative_path)

    assert os.path.exists(uploaded_file), (
        f"File {uploaded_file} was not found in the filesystem"
    )
    assert Image.objects.filter(id=file_id).exists(), (
        f"Image with ID {file_id} was not found in the database"
    )

    # Delete the image from the database and the file from the file system.
    # The signal to delete the file from the filesystem is triggered in the Image model.
    response = client.delete(f"/v1/content/images/{file_id}")

    # Assert file is deleted from filesystem and the database.
    assert response.status_code == 204
    assert not os.path.exists(uploaded_file), (
        f"File {uploaded_file} was not deleted from the filesystem"
    )
    assert not Image.objects.filter(id=file_id).exists(), (
        f"Image with ID {file_id} was not deleted from the database"
    )


@pytest.mark.django_db
def test_destroy_non_existent_file_view(client: APIClient) -> None:
    """
    Test the destroy/delete view for a non-existent file.

    This test can output a 'Not Found: /v1/content/images/some_random_uuid/' console warning.
    This is expected.
    """

    non_existent_file_uuid = uuid.uuid4()  # Generates a random UUID

    response = client.delete(f"/v1/content/images/{non_existent_file_uuid}")
    assert response.status_code == 404


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
