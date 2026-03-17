# SPDX-License-Identifier: AGPL-3.0-or-later
import io
import time

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client
from PIL import Image as TestImage

from communities.organizations.factories import OrganizationFactory
from content.factories import ImageFactory


def _make_icon_image_file():
    img = TestImage.new("RGB", (100, 100), color="red")
    img_file = io.BytesIO()
    img.save(img_file, format="JPEG")
    img_file.seek(0)
    return SimpleUploadedFile(
        "test_icon.jpg", img_file.getvalue(), content_type="image/jpeg"
    )


@pytest.mark.django_db
@pytest.mark.filescan_integration
def test_image_icon_create_400(client: Client):
    image = ImageFactory()

    response = client.post(
        path="/v1/content/image_icon",
        data={"file_object": image.id},
    )

    assert response.status_code == 400


@pytest.mark.django_db
@pytest.mark.filescan_integration
def test_image_icon_create_201(client: Client):
    org = OrganizationFactory()

    # Retry on transient "could not be scanned" when filescan is warming up (e.g. in CI).
    max_attempts = 5
    last_response = None
    for attempt in range(max_attempts):
        file = _make_icon_image_file()
        response = client.post(
            path="/v1/content/image_icon",
            data={
                "entity_id": str(org.id),
                "entity_type": "organization",
                "file_object": file,
            },
            format="multipart",
        )
        last_response = response
        if response.status_code == 201:
            break
        body = response.json()
        if (
            body.get("nonFieldErrors")
            == ["The file could not be scanned. Please try again later."]
            and attempt < max_attempts - 1
        ):
            time.sleep(0.5)
            continue
        break

    assert last_response is not None
    assert last_response.status_code == 201
