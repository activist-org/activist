# SPDX-License-Identifier: AGPL-3.0-or-later

import os
from pathlib import Path

import httpx


def test_infected_file_includes_quarantine_id() -> None:
    """Integration-style check: infected file yields quarantine_id and is stored in quarantine."""
    base_url = "http://localhost:9101"
    scan_url = f"{base_url}/scan"

    tests_dir = Path(__file__).resolve().parent.parent / "tests" / "test_files"
    eicar_path = tests_dir / "eicar.txt"

    project_root = Path(__file__).resolve().parent.parent.parent.parent
    default_quarantine = project_root / "quarantine"
    quarantine_dir = Path(os.getenv("FILESCAN_QUARANTINE_TEST_DIR", str(default_quarantine)))
    quarantine_path = None

    try:
        with eicar_path.open("rb") as f:
            files = {"file": ("eicar.txt", f, "text/plain")}
            response = httpx.post(scan_url, files=files, timeout=30.0)

        assert response.status_code == 200
        body = response.json()
        assert body["malware_detected"] is True
        assert "quarantine_id" in body
        quarantine_id = body["quarantine_id"]
        assert isinstance(quarantine_id, str) and quarantine_id

        quarantine_path = quarantine_dir / f"{quarantine_id}__eicar.txt"
        assert quarantine_path.exists(), (
            f"Expected quarantine file at {quarantine_path} to exist"
        )
    finally:
        if quarantine_path is not None and quarantine_path.exists():
            quarantine_path.unlink()
