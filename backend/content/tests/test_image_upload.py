# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for Image upload-related functionality.
"""

import io
import os
import uuid
from datetime import datetime
from typing import Generator

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image as TestImage
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from content.factories import ImageFactory
from content.models import Image
from content.serializers import ImageSerializer

MEDIA_ROOT = settings.MEDIA_ROOT  # Ensure this points to the imagefolder


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
def test_image_list_view(client: APIClient) -> None:
    """
    Test the list view for images.
    This is like a GET request.
    """
    images = ImageFactory.create_batch(3)
    filenames = [image.file_object.name for image in images]

    response = client.get("/v1/content/images/")

    assert response.status_code == 200
    assert response.json()["count"] == 3

    for filename in filenames:
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        if os.path.exists(file_path):
            os.remove(file_path)


@pytest.mark.django_db
def test_image_create_view(client: APIClient, image_with_file: Image) -> None:
    """
    Test the create view for images.
    This is like a POST request.

    1. Create an image file using the image_with_file fixture.
    2. Delete created image entry from the test database. This entry is a side effect of the fixture and is unneeded.
    3. Create an organization.
    4. Make a POST request to the image create endpoint with org info and image file.
    5. Check that the response is a 201 status code.
    6. Check that the image was inserted into the database.
    7. Check that the uploaded/savedfile has a sanitized, UUID filename.
    8. Delete the file from the file system. This is for test cleanup and does not happen in production.
    """

    image = image_with_file

    Image.objects.all().delete()

    org = OrganizationFactory()
    assert org is not None, "Organization was not created"

    data = {"organization_id": str(org.id), "file_object": image.file_object}

    response = client.post("/v1/content/images/", data, format="multipart")

    assert (
        response.status_code == 201
    ), f"Expected status code 201, but got {response.status_code}."
    assert (
        Image.objects.count() == 1
    ), "Expected one image in the database, but found more than one."

    uploaded_file = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    assert os.path.exists(uploaded_file)

    uuid_filename = os.path.splitext(os.path.basename(uploaded_file))[0]

    try:
        uuid_obj = uuid.UUID(uuid_filename, version=4)
        assert str(uuid_obj) == uuid_filename
    except ValueError:
        assert False, f"Filename is not a valid UUID: {uuid_filename}"

    file_object = response.json()["fileObject"].split("/")[-1]
    file_to_delete = os.path.join(settings.MEDIA_ROOT, "images", file_object)
    if os.path.exists(file_to_delete):
        os.remove(file_to_delete)


@pytest.mark.django_db
def test_image_create_missing_file(client: APIClient) -> None:
    """
    Test the create view for images with a missing file.
    Test can return 'WARNING ... Bad Request: /v1/content/images/'. This is expected.
    """

    org = OrganizationFactory()
    data = {"organization_id": str(org.id)}  # no file_object provided
    response = client.post("/v1/content/images/", data, format="multipart")

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
    # Take the first 100 bytes
    corrupted_img = img_file.getvalue()[:100]
    # Add some corrupt data after
    corrupted_img += b"corrupteddata"
    # Wrap the corrupted image data in a SimpleUploadedFile.
    file = SimpleUploadedFile(
        "corrupted_image.jpg", corrupted_img, content_type="image/jpeg"
    )

    data = {"organization_id": str(org.id), "file_object": file}

    response = client.post("/v1/content/images/", data, format="multipart")

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

    data = {"organization_id": str(org.id), "file_object": file}

    response = client.post("/v1/content/images/", data, format="multipart")

    assert response.status_code == 400

    # DATA_UPLOAD_MAX_MEMORY_SIZE and IMAGE_UPLOAD_MAX_FILE_SIZE are set in core/settings.py.
    # For whatever reason, the file size limit is not being enforced. To get around this,
    # we're checking the file size in the serializer validation.
    assert (
        f"The file size ({file.size} bytes) is too large. The maximum file size is {settings.IMAGE_UPLOAD_MAX_FILE_SIZE} bytes."
        in response.json()["nonFieldErrors"]
    )
