# SPDX-License-Identifier: AGPL-3.0-or-later

from pathlib import Path

import httpx


def test_infected_file_includes_quarantine_id() -> None:
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
    assert isinstance(body["quarantine_id"], str) and body["quarantine_id"]
