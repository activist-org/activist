# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Shared helpers for HTTP integration tests against a running filescan service.
"""

from __future__ import annotations

import os
from pathlib import Path

import httpx
import pytest

BASE_URL = os.getenv("FILESCAN_BASE_URL", "http://localhost:9101")

_INTEGRATION_DIR = Path(__file__).resolve().parent
TEST_FILES_DIR = _INTEGRATION_DIR.parent / "tests" / "test_files"


def require_filescan_service() -> None:
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
