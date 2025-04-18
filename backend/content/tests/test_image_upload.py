# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for Image upload-related functionality.
"""

import io
import os
import uuid
from typing import Any, Dict, Generator

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image as TestImage
from requests import Response
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import OrganizationFactory
from content.factories import ImageFactory
from content.models import Image
from content.serializers import ImageSerializer
from events.factories import EventFactory

MEDIA_ROOT = settings.MEDIA_ROOT  # Ensure this points to the image folder


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
    assert org is not None, "Organization was not created"

    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)

    file = SimpleUploadedFile(
        "test_create_image.jpg", img_file.getvalue(), content_type="image/jpeg"
    )

    data = {"organization_id": str(org.id), "file_object": file}

    return data


def create_event_and_image(user: UserModel) -> Dict[str, Any]:
    """
    Helper function to create a test event and a simple test image.

    'user' is needed to fill out 'created_by' field and use in tests.
    """
    event = EventFactory(created_by=user)
    assert event is not None, "Event was not created"

    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)

    file = SimpleUploadedFile(
        "test_event_image.jpg", img_file.getvalue(), content_type="image/jpeg"
    )

    data = {"event_id": str(event.id), "file_object": file}

    return data


def get_uploaded_file_path(response: Response) -> str:
    """
    Helper function to get the uploaded file URL from the response.
    """
    file_url = response
    relative_path = file_url.replace("http://testserver/media/", "").lstrip("/")
    uploaded_file = os.path.join(settings.MEDIA_ROOT, relative_path)

    return uploaded_file


def get_file_to_delete(response: Response) -> str:
    """
    Helper function to get the file to delete from the response.
    """
    file_object = response.split("/")[-1]
    file_to_delete = os.path.join(settings.MEDIA_ROOT, "images", file_object)

    return file_to_delete


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
def test_image_create_view(client: APIClient) -> None:
    """
    Test the create view for images.
    This is like a POST request.

    1. Create an organization and a test image.
    2. Make a POST request to the image create endpoint with org info and image file.
    3. Check that the response is a 201 status code.
    4. Check that the image was inserted into the database.
    5. Check that the file was uploaded/saved to the media root.
    6. Check that the uploaded/savedfile has a sanitized, UUID filename.
    8. Delete the file from the file system. This is for test cleanup and does not happen in production.
    """

    data = create_organization_and_image()

    response = client.post("/v1/content/images/", data, format="multipart")

    assert (
        response.status_code == 201
    ), f"Expected status code 201, but got {response.status_code}."
    assert (
        Image.objects.count() == 1
    ), "Expected one image in the database, but found more than one."

    # Assert file exists in filesystem.
    file_url = response.json()["fileObject"]
    relative_path = file_url.replace("http://testserver/media/", "").lstrip("/")
    uploaded_file = os.path.join(settings.MEDIA_ROOT, relative_path)

    assert os.path.exists(
        uploaded_file
    ), f"File {uploaded_file} was not found in the filesystem"

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
    # Take the first 100 bytes.
    corrupted_img = img_file.getvalue()[:100]
    # Add some corrupt data after.
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

    response = client.post("/v1/content/images/", data, format="multipart")
    file_id = response.json()["id"]

    # Assert file exists in filesystem and the database.
    file_url = response.json()["fileObject"]
    relative_path = file_url.replace("http://testserver/media/", "").lstrip("/")
    uploaded_file = os.path.join(settings.MEDIA_ROOT, relative_path)

    assert os.path.exists(
        uploaded_file
    ), f"File {uploaded_file} was not found in the filesystem"
    assert Image.objects.filter(
        id=file_id
    ).exists(), f"Image with ID {file_id} was not found in the database"

    # Delete the image from the database and the file from the file system.
    # The signal to delete the file from the filesystem is triggered in the Image model.
    response = client.delete(f"/v1/content/images/{file_id}/")

    # Assert file is deleted from filesystem and the database.
    assert response.status_code == 204
    assert not os.path.exists(
        uploaded_file
    ), f"File {uploaded_file} was not deleted from the filesystem"
    assert not Image.objects.filter(
        id=file_id
    ).exists(), f"Image with ID {file_id} was not deleted from the database"


@pytest.mark.django_db
def test_destroy_non_existent_file_view(client: APIClient) -> None:
    """
    Test the destroy/delete view for a non-existent file.

    This test can output a 'Not Found: /v1/content/images/some_random_uuid/' console warning.
    This is expected.
    """

    non_existent_file_uuid = uuid.uuid4()  # Generates a random UUID

    response = client.delete(f"/v1/content/images/{non_existent_file_uuid}/")
    assert response.status_code == 404


@pytest.mark.django_db
def test_event_icon_image_upload(client: APIClient) -> None:
    """
    Test the event image icon upload view.

    Don't re-test the file upload functionality here. It's covered in the test_image_create_view() test.

    1. Create a user and authenticate so that we can update the event icon_url field.
    2. Upload an event icon image along with the event id.
    3. Update the event icon_url field with the uploaded image URL.
    4. Return the updated icon_url field.
    """

    user = UserFactory()
    # Force the client to be type APIClient. Don't know why it's not already, since it's typed in the function signature.
    client = APIClient()
    client.force_authenticate(user=user)

    data = create_event_and_image(user)

    # Upload the image.
    response = client.post("/v1/content/images/", data, format="multipart")

    # Don't test file upload outcome here. It's covered in the test_image_create_view() test.

    uploaded_file = get_uploaded_file_path(response.json()["fileObject"])
    uuid_filename = os.path.splitext(os.path.basename(uploaded_file))[0]

    # Don't test the filename is a valid UUID here. It's covered in the test_image_create_view() test.

    # Update the event icon_url_id field with the uploaded image URL.
    patch_response = client.patch(
        f"/v1/events/events/{data['event_id']}/",
        {"iconUrl": uuid_filename},
        format="json",
    )

    assert (
        patch_response.status_code == 200
    ), f"Expected 200 on event patch, got {patch_response.status_code}"
    assert (
        patch_response.json()["iconUrl"] == uuid_filename
    ), f"Expected iconUrl to be updated to {uuid_filename}, got {patch_response.json()['iconUrl']}"

    # Clean up the uploaded file after the test.
    file_to_delete = get_file_to_delete(response.json()["fileObject"])

    if os.path.exists(file_to_delete):
        os.remove(file_to_delete)
