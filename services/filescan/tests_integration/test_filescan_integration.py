# SPDX-License-Identifier: AGPL-3.0-or-later

"""
Integration tests that exercise the running filescan service
and a real ClamAV daemon, over HTTP.

These tests assume the service is reachable at FILESCAN_BASE_URL
(default: http://localhost:9101) and that clamd is running and
configured as in the Docker image.
"""

from __future__ import annotations

import httpx

from tests.eicar_payload import eicar_test_fileobj
from tests_integration.integration_helpers import (
    BASE_URL,
    TEST_FILES_DIR,
    require_filescan_service,
)


def test_health_integration_ok() -> None:
    require_filescan_service()

    response = httpx.get(f"{BASE_URL}/health", timeout=2.0)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_scan_empty_file_integration() -> None:
    require_filescan_service()

    empty_path = TEST_FILES_DIR / "empty.txt"
    with empty_path.open("rb") as f:
        files = {"file": ("empty.txt", f, "text/plain")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "empty.txt"
    # With a real ClamAV daemon, an empty file should be treated as clean.
    assert body["malware_detected"] is False


def test_scan_clean_file_integration() -> None:
    require_filescan_service()

    clean_path = TEST_FILES_DIR / "clean.txt"
    with clean_path.open("rb") as f:
        files = {"file": ("clean.txt", f, "text/plain")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "clean.txt"
    assert body["malware_detected"] is False


def test_scan_eicar_file_integration() -> None:
    require_filescan_service()

    files = {"file": ("eicar.txt", eicar_test_fileobj(), "text/plain")}
    response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "eicar.txt"
    assert body["malware_detected"] is True
    assert "signature" in body
    assert isinstance(body["signature"], str) and body["signature"]


def test_scan_fake_binary_image_integration() -> None:
    require_filescan_service()

    fake_image_path = TEST_FILES_DIR / "fake_image.bin"
    with fake_image_path.open("rb") as f:
        files = {"file": ("fake.png", f, "image/png")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "fake.png"
    assert body["malware_detected"] is False
