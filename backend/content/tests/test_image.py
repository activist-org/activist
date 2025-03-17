# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for Image upload-related functionality.
"""

import os
from datetime import datetime
from typing import Generator

import pytest
from django.conf import settings
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

    # Test the upload behavior. Make the POST request to the image create endpoint.
    # This will create a second copy of the image file in the media root.
    # This is correct, default, upload behavior. POST is supposed to put a file on the server and add an Image entry to the database.
    response = client.post("/v1/content/images/", data, format="multipart")

    assert (
        response.status_code == 201
    ), f"Expected status code 201, but got {response.status_code}."
    assert (
        Image.objects.count() == 1
    ), "Expected one image in the database, but found more than one."

    # Check if the file was "uploaded".
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
    """

    org = OrganizationFactory()
    data = {"organization_id": str(org.id)}  # no file_object provided
    response = client.post("/v1/content/images/", data, format="multipart")

    assert response.status_code == 400
    assert "fileObject" in response.json()
    assert "No file was submitted." in response.json()["fileObject"]
