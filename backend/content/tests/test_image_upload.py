# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for Image upload-related functionality.
"""

import io
import os
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

# Adjust MEDIA_ROOT for testing (temporary directory)
MEDIA_ROOT = settings.MEDIA_ROOT  # Ensure this points to the imagefolder


@pytest.fixture
def image_with_file() -> Generator[Image, None, None]:
    """
    Fixture for creating an image with a file.
    Deletes the file after the test.
    """
    # Clean up any leftover files.
    image = ImageFactory()  # create image using the factory

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

    # Check if the file exists in MEDIA_ROOT.
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

    # Check if the file exists in MEDIA_ROOT.
    file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    assert os.path.exists(file_path)


@pytest.mark.django_db
def test_image_serializer_missing_file() -> None:
    """
    Test the serializer with a missing file.
    """
    serializer = ImageSerializer(data={})  # no file_object
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

    # Test cleanup. Delete files from the filesystem.
    for filename in filenames:
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        if os.path.exists(file_path):
            os.remove(file_path)


@pytest.mark.django_db
def test_image_create_view(client: APIClient, image_with_file: Image) -> None:
    """
    Test the create view for images.
    This is like a POST request.
    """
    # Use the 'image_with_file' fixture to create an image.
    # This is "the file on the user's computer". The rest of the test is "uploading it to the server".
    # That is the default, correct behavior. The fixture will delete the file after the test.
    image = image_with_file

    # Image.objects (there should be only one) in the database are a side effect of the fixture. Delete them here.
    # The client.post call will create a file "on the server" and a database entry.
    Image.objects.all().delete()

    org = OrganizationFactory()
    assert org is not None, "Organization was not created"

    data = {"organization_id": str(org.id), "file_object": image.file_object}

    # Make the POST request to the image create endpoint.
    # This will create a second copy of the image file in the media root. This copy will have a UUID filename.
    # This is correct, default, upload behavior. POST is supposed to put a file on the server and add an Image entry to the database.
    response = client.post("/v1/content/images/", data, format="multipart")

    assert (
        response.status_code == 201
    ), f"Expected status code 201, but got {response.status_code}."
    assert (
        Image.objects.count() == 1
    ), "Expected one image in the database, but found more than one."

    # Check if the file was "uploaded". "Uploaded" filename will be a UUID.
    uploaded_file = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    assert os.path.exists(uploaded_file)

    # Get the actual filename of the "uploaded" file, so we can delete it from the file system.
    # This is for test cleanup. In production, the file is not deleted.
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
