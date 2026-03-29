# SPDX-License-Identifier: AGPL-3.0-or-later

"""
Integration tests that exercise the running filescan service
and a real ClamAV daemon, over HTTP.

These tests assume the service is reachable at FILESCAN_BASE_URL
(default: http://localhost:9101) and that clamd is running and
configured as in the Docker image.
"""

from __future__ import annotations

import os
from pathlib import Path

import httpx
import pytest

BASE_URL = os.getenv("FILESCAN_BASE_URL", "http://localhost:9101")
BASE_DIR = Path(__file__).resolve().parent
TEST_FILES_DIR = BASE_DIR.parent / "tests" / "test_files"


def _require_service() -> None:
    """
    Skip tests if the running service is not reachable.
    """
    try:
        response = httpx.get(f"{BASE_URL}/health", timeout=2.0)
    except Exception as exc:  # noqa: BLE001
        pytest.skip(f"filescan service not reachable at {BASE_URL}: {exc}")

    if response.status_code != 200:
        pytest.skip(
            f"filescan service at {BASE_URL} returned {response.status_code} "
            "for /health; expected 200.",
        )


def test_health_integration_ok() -> None:
    _require_service()

    response = httpx.get(f"{BASE_URL}/health", timeout=2.0)
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_scan_empty_file_integration() -> None:
    _require_service()

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
    _require_service()

    clean_path = TEST_FILES_DIR / "clean.txt"
    with clean_path.open("rb") as f:
        files = {"file": ("clean.txt", f, "text/plain")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "clean.txt"
    assert body["malware_detected"] is False


def test_scan_eicar_file_integration() -> None:
    _require_service()

    eicar_path = TEST_FILES_DIR / "eicar.txt"
    with eicar_path.open("rb") as f:
        files = {"file": ("eicar.txt", f, "text/plain")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "eicar.txt"
    assert body["malware_detected"] is True
    assert "signature" in body
    assert isinstance(body["signature"], str) and body["signature"]


def test_scan_fake_binary_image_integration() -> None:
    _require_service()

    fake_image_path = TEST_FILES_DIR / "fake_image.bin"
    with fake_image_path.open("rb") as f:
        files = {"file": ("fake.png", f, "image/png")}
        response = httpx.post(f"{BASE_URL}/scan", files=files, timeout=10.0)

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "fake.png"
    assert body["malware_detected"] is False
