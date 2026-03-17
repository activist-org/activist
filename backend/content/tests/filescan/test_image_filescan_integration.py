# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Integration tests: backend image upload flow + real filescan service.

These tests assume that the filescan service is reachable from the backend
container (e.g. via docker-compose with the filescan service running on
http://filescan:9101) and that the backend is configured with FILESCAN_URL
or FILESCAN_BASE_URL accordingly.
"""

from __future__ import annotations

import io
from typing import Any, Dict

import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image as TestImage
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from content.models import Image


@pytest.fixture
def client() -> APIClient:
    """Use DRF APIClient so multipart and request.data match the view."""
    return APIClient()


def _make_clean_image_file(name: str = "clean.jpg") -> SimpleUploadedFile:
    img = TestImage.new("RGB", (100, 100), color="red")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return SimpleUploadedFile(name, buf.getvalue(), content_type="image/jpeg")


def _make_eicar_file(name: str = "eicar.txt") -> SimpleUploadedFile:
    """
    Create a SimpleUploadedFile containing the standard EICAR test string.

    This string is a safe, industry-standard antivirus test pattern.
    """
    eicar_bytes = (
        b"X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
    )
    return SimpleUploadedFile(name, eicar_bytes, content_type="text/plain")


def _base_payload(org_id: str, file: SimpleUploadedFile) -> Dict[str, Any]:
    return {
        "entity_id": org_id,
        "entity_type": "organization",
        "file_object": file,
    }


@pytest.mark.django_db
def test_clean_image_upload_passes_filescan(client: APIClient) -> None:
    """
    Clean image should be accepted end-to-end (backend + filescan).
    """
    org = OrganizationFactory()
    file = _make_clean_image_file()

    data = _base_payload(str(org.id), file)
    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 201
    body = response.json()
    assert len(body) == 1
    assert Image.objects.count() == 1
    assert "fileObject" in body[0]


@pytest.mark.django_db
def test_malware_eicar_upload_rejected_by_filescan(client: APIClient) -> None:
    """
    EICAR test file should be rejected by the backend after filescan flags it.
    """
    org = OrganizationFactory()
    file = _make_eicar_file()

    data = _base_payload(str(org.id), file)
    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 400
    body = response.json()
    # Serializer raises a non-field ValidationError -> DRF exposes it under nonFieldErrors.
    assert "The uploaded file was rejected by the security scan." in body.get(
        "nonFieldErrors", []
    )
    # No Image records should have been created.
    assert Image.objects.count() == 0


@pytest.mark.django_db
def test_large_clean_image_still_passes_filescan(client: APIClient) -> None:
    """
    Large-but-allowed clean image should still pass both size and scan checks.
    """
    org = OrganizationFactory()

    # Generate a reasonably large JPEG under IMAGE_UPLOAD_MAX_FILE_SIZE.
    img = TestImage.new("RGB", (1500, 1500), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    file = SimpleUploadedFile(
        "large_clean.jpg",
        buf.getvalue(),
        content_type="image/jpeg",
    )

    # Sanity check that we're under the configured limit so this is not rejected by size.
    assert file.size < settings.IMAGE_UPLOAD_MAX_FILE_SIZE

    data = _base_payload(str(org.id), file)
    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code == 201
    assert Image.objects.count() == 1


@pytest.mark.django_db
def test_fake_image_binary_handled_gracefully(client: APIClient) -> None:
    """
    A file uploaded as image content-type but with non-image bytes should
    be handled gracefully (2xx or 4xx, but not 5xx).
    """
    org = OrganizationFactory()
    # Non-image bytes but declared as image.
    fake_bytes = b"\x00\x01\x02notanimage"
    file = SimpleUploadedFile(
        "fake.png",
        fake_bytes,
        content_type="image/png",
    )

    data = _base_payload(str(org.id), file)
    response = client.post("/v1/content/images", data, format="multipart")

    assert response.status_code in (201, 400)
