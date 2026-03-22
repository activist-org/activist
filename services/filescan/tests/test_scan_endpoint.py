# SPDX-License-Identifier: AGPL-3.0-or-later

from pathlib import Path
from typing import Any, Dict, List

from fastapi.testclient import TestClient
from main import app, notify_malware_quarantined

BASE_DIR = Path(__file__).parent
TEST_FILES_DIR = BASE_DIR / "test_files"


client = TestClient(app)


def _mock_scan_with_clamav(
    monkeypatch,
    result: tuple[bool, str, str | None],
) -> None:
    """
    Patch main.scan_with_clamav to return a fixed result.
    """

    async def _fake_scan(_file_bytes: bytes) -> tuple[bool, str, str | None]:
        return result

    monkeypatch.setattr("main.scan_with_clamav", _fake_scan)


def _mock_scan_with_csam(
    monkeypatch,
    result: tuple[bool, str, str | None],
) -> None:
    """
    Patch main.scan_with_csam to return a fixed result.
    """

    async def _fake_scan(_file_bytes: bytes) -> tuple[bool, str, str | None]:
        return result

    monkeypatch.setattr("main.scan_with_csam", _fake_scan)


def test_healthcheck_returns_ok() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_scan_without_file_returns_400() -> None:
    response = client.post("/scan")
    assert response.status_code == 400
    body = response.json()
    assert "detail" in body


CLEAN_RESULT = (False, "No malware detected by ClamAV.", None)
CLEAN_RESULT_CSAM = (False, "No CSAM detected.", None)


def test_scan_empty_file_treated_as_clean(monkeypatch) -> None:
    _mock_scan_with_clamav(monkeypatch, CLEAN_RESULT)
    _mock_scan_with_csam(monkeypatch, CLEAN_RESULT_CSAM)

    empty_path = TEST_FILES_DIR / "empty.txt"
    with empty_path.open("rb") as f:
        response = client.post("/scan", files={"file": ("empty.txt", f, "text/plain")})

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "empty.txt"
    assert body["malware_detected"] is False


def test_scan_clean_file_treated_as_clean(monkeypatch) -> None:
    _mock_scan_with_clamav(monkeypatch, CLEAN_RESULT)
    _mock_scan_with_csam(monkeypatch, CLEAN_RESULT_CSAM)
    clean_path = TEST_FILES_DIR / "clean.txt"
    with clean_path.open("rb") as f:
        response = client.post("/scan", files={"file": ("clean.txt", f, "text/plain")})

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "clean.txt"
    assert body["malware_detected"] is False


def test_scan_eicar_file_detects_malware(monkeypatch) -> None:
    _mock_scan_with_clamav(
        monkeypatch,
        (True, "Malware detected by ClamAV.", "Eicar-Test-Signature"),
    )
    _mock_scan_with_csam(monkeypatch, CLEAN_RESULT_CSAM)
    eicar_path = TEST_FILES_DIR / "eicar.txt"
    with eicar_path.open("rb") as f:
        response = client.post("/scan", files={"file": ("eicar.txt", f, "text/plain")})

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "eicar.txt"
    assert body["malware_detected"] is True
    # Signature name can vary slightly depending on definitions, so just assert it's present.
    assert "signature" in body
    assert isinstance(body["signature"], str) and body["signature"]
    assert body.get("source") == "clamav"
    assert "quarantine_id" in body
    assert isinstance(body["quarantine_id"], str) and body["quarantine_id"]


def test_scan_csam_detected(monkeypatch) -> None:
    """When CSAM scanner returns positive, response has malware_detected True and source csam."""
    _mock_scan_with_clamav(monkeypatch, CLEAN_RESULT)
    _mock_scan_with_csam(
        monkeypatch,
        (True, "CSAM detected.", "PhotoDNA-match"),
    )
    with (TEST_FILES_DIR / "clean.txt").open("rb") as f:
        response = client.post("/scan", files={"file": ("clean.txt", f, "text/plain")})
    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "clean.txt"
    assert body["malware_detected"] is True
    assert body["detail"] == "CSAM detected."
    assert body.get("signature") == "PhotoDNA-match"
    assert body.get("source") == "csam"


def test_scan_large_clean_file_treated_as_clean(monkeypatch) -> None:
    _mock_scan_with_clamav(monkeypatch, CLEAN_RESULT)
    _mock_scan_with_csam(monkeypatch, CLEAN_RESULT_CSAM)
    large_clean_path = TEST_FILES_DIR / "large_clean.txt"
    with large_clean_path.open("rb") as f:
        response = client.post(
            "/scan",
            files={"file": ("large_clean.txt", f, "text/plain")},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "large_clean.txt"
    assert body["malware_detected"] is False


def test_scan_fake_binary_image_treated_as_clean(monkeypatch) -> None:
    """
    Ensure that a file uploaded with an image content-type but non-image content
    is still treated purely based on its bytes by ClamAV.
    """
    _mock_scan_with_clamav(monkeypatch, CLEAN_RESULT)
    _mock_scan_with_csam(monkeypatch, CLEAN_RESULT_CSAM)

    fake_image_path = TEST_FILES_DIR / "fake_image.bin"
    with fake_image_path.open("rb") as f:
        response = client.post(
            "/scan",
            files={"file": ("fake.png", f, "image/png")},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "fake.png"
    assert body["malware_detected"] is False


def test_notify_malware_quarantined_builds_and_posts_event(monkeypatch) -> None:
    """
    notify_malware_quarantined should build a generic envelope and POST it
    to the configured backend URL when alerts are enabled.
    """
    posted: List[Dict[str, Any]] = []

    class DummyResponse:
        def __init__(self) -> None:
            self.status_code = 200
            self.text = ""

    def fake_post(
        url: str, json: Dict[str, Any], headers: Dict[str, str], timeout: float
    ) -> DummyResponse:
        posted.append(
            {"url": url, "json": json, "headers": headers, "timeout": timeout}
        )
        return DummyResponse()

    monkeypatch.setenv("FILESCAN_ALERTS_ENABLED", "true")
    monkeypatch.setenv("ALERTS_BACKEND_URL", "http://backend/internal/security-events")
    monkeypatch.setenv("ALERTS_BACKEND_TOKEN", "secret-token")
    monkeypatch.setattr("notification_helpers.httpx.post", fake_post)

    event = {
        "filename": "eicar.txt",
        "signature": "EICAR-TEST",
        "source": "clamav",
        "quarantine_id": "abc123",
        "detail": "Malware detected by ClamAV.",
    }

    notify_malware_quarantined(event)

    assert posted, "Expected notify_malware_quarantined to POST an event"
    sent = posted[0]
    assert sent["url"] == "http://backend/internal/security-events"
    assert sent["headers"]["X-Internal-Token"] == "secret-token"
    envelope = sent["json"]
    assert envelope["type"] == "malware_quarantined"
    assert envelope["producer"] == "filescan"
    assert envelope["payload"]["filename"] == "eicar.txt"
    assert envelope["payload"]["quarantine_id"] == "abc123"
