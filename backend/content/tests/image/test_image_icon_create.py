# SPDX-License-Identifier: AGPL-3.0-or-later
import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client
from PIL import Image as TestImage

from communities.organizations.factories import OrganizationFactory
from content.factories import ImageFactory

pytestmark = pytest.mark.django_db


def test_image_icon_create_400(client: Client):
    image = ImageFactory()

    response = client.post(
        path="/v1/content/image_icon",
        data={"file_object": image.id},
    )

    assert response.status_code == 400


def test_image_icon_create_201(client: Client):
    org = OrganizationFactory()

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

    response = client.post(
        path="/v1/content/image_icon",
        data={
            "entity_id": str(org.id),
            "entity_type": "organization",
            "file_object": files,
        },
        format="multipart",
    )
    # response = client.post("/v1/content/images", data, format="multipart")

    print(response.json())

    assert response.status_code == 201
