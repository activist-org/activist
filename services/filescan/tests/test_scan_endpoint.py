# SPDX-License-Identifier: AGPL-3.0-or-later

from pathlib import Path

from fastapi.testclient import TestClient

from main import app


BASE_DIR = Path(__file__).parent
TEST_FILES_DIR = BASE_DIR / "test_files"


client = TestClient(app)


class _FakeClamdClient:
    """
    Lightweight fake ClamAV client for tests.

    It mimics the subset of the pyclamd API that our code relies on:
    - ping()
    - scan_stream(bytes)
    """

    def __init__(self, scan_result: dict | None) -> None:
        self._scan_result = scan_result

    def ping(self) -> bool:
        return True

    def scan_stream(self, data: bytes) -> dict | None:  # noqa: ARG002
        return self._scan_result


def _mock_clamd_client(monkeypatch, scan_result: dict | None) -> None:
    """
    Patch main.get_clamd_client to return a fake client with a fixed scan result.
    """

    def _factory() -> _FakeClamdClient:
        return _FakeClamdClient(scan_result)

    monkeypatch.setattr("main.get_clamd_client", _factory)


def test_healthcheck_returns_ok() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_scan_without_file_returns_400() -> None:
    response = client.post("/scan")
    assert response.status_code == 400
    body = response.json()
    assert "detail" in body


def test_scan_empty_file_treated_as_clean(monkeypatch) -> None:
    _mock_clamd_client(monkeypatch, scan_result=None)

    empty_path = TEST_FILES_DIR / "empty.txt"
    with empty_path.open("rb") as f:
        response = client.post("/scan", files={"file": ("empty.txt", f, "text/plain")})

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "empty.txt"
    assert body["malware_detected"] is False


def test_scan_clean_file_treated_as_clean(monkeypatch) -> None:
    _mock_clamd_client(monkeypatch, scan_result=None)
    clean_path = TEST_FILES_DIR / "clean.txt"
    with clean_path.open("rb") as f:
        response = client.post("/scan", files={"file": ("clean.txt", f, "text/plain")})

    assert response.status_code == 200
    body = response.json()
    assert body["filename"] == "clean.txt"
    assert body["malware_detected"] is False


def test_scan_eicar_file_detects_malware(monkeypatch) -> None:
    _mock_clamd_client(
        monkeypatch,
        scan_result={"stream": ("FOUND", "Eicar-Test-Signature")},
    )
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


def test_scan_large_clean_file_treated_as_clean(monkeypatch) -> None:
    _mock_clamd_client(monkeypatch, scan_result=None)
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
    _mock_clamd_client(monkeypatch, scan_result=None)

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

