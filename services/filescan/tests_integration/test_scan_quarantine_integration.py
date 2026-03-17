# SPDX-License-Identifier: AGPL-3.0-or-later

import os
from pathlib import Path
from typing import Iterator

import httpx
import pytest


@pytest.fixture
def quarantine_dir() -> Iterator[Path]:
    """
    Resolve the quarantine directory for the current environment and
    clean up any EICAR files created by this test.

    The filescan service writes quarantined files under
    FILESCAN_QUARANTINE_DIR (default: /var/filescan/quarantine), with
    filenames of the form "<quarantine_id>__<original_filename>".
    """
    # Match the default used by the filescan service.
    raw = os.getenv("FILESCAN_QUARANTINE_DIR", "/var/filescan/quarantine")
    qdir = Path(raw)
    yield qdir

    # Best-effort cleanup: remove any EICAR quarantine files this test created.
    if qdir.is_dir():
        for path in qdir.glob("*__eicar.txt"):
            try:
                path.unlink()
            except FileNotFoundError:
                # If it was already removed, that's fine.
                continue


def test_infected_file_includes_quarantine_id(quarantine_dir: Path) -> None:
    """Integration-style check: infected file yields quarantine_id in response."""

    base_url = "http://localhost:9101"
    scan_url = f"{base_url}/scan"

    tests_dir = Path(__file__).resolve().parent.parent / "tests" / "test_files"
    eicar_path = tests_dir / "eicar.txt"

    with eicar_path.open("rb") as f:
        files = {"file": ("eicar.txt", f, "text/plain")}
        response = httpx.post(scan_url, files=files, timeout=30.0)

    assert response.status_code == 200
    body = response.json()
    assert body["malware_detected"] is True
    assert "quarantine_id" in body
    quarantine_id = body["quarantine_id"]
    assert isinstance(quarantine_id, str) and quarantine_id

    # Verify that the quarantine file was written to the configured directory.
    quarantine_path = quarantine_dir / f"{quarantine_id}__eicar.txt"
    assert quarantine_path.exists(), f"Expected quarantine file at {quarantine_path} to exist"
