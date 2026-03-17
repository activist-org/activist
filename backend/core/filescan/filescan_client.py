"""
Small HTTP client for the filescan service, used by the backend.

This module is the single place where the backend knows how to call the
``/scan`` endpoint. Code that needs to talk to the filescan service
should import and use ``scan_file`` instead of reimplementing the
protocol.
"""

from __future__ import annotations

import os
from typing import Any, Dict

import httpx
from django.core.files.uploadedfile import UploadedFile


class FilescanError(Exception):
    """Raised when the filescan service is unavailable or returns an error response."""


def _build_scan_url() -> str:
    """
    Compute the URL for the scan endpoint.

    Precedence:
    1. FILESCAN_URL (full URL to /scan)
    2. FILESCAN_BASE_URL + '/scan'
    3. Default 'http://filescan:9101/scan'

    Returns
    -------
    str
        URL for the scan endpoint.
    """
    direct = os.getenv("FILESCAN_URL")
    if direct:
        return direct

    base = os.getenv("FILESCAN_BASE_URL")
    if base:
        return base.rstrip("/") + "/scan"

    return "http://filescan:9101/scan"


FILESCAN_URL = _build_scan_url()


def scan_file(upload: UploadedFile) -> Dict[str, Any]:
    """
    Call the filescan service with the uploaded file and return its JSON response.

    Parameters
    ----------
    upload : UploadedFile
        The uploaded file to send to the filescan service.

    Returns
    -------
    dict of str to Any
        JSON response from the service (e.g. ``malware_detected``, ``detail``).

    Raises
    ------
    FilescanError
        On network error or non-200 response.
    """
    try:
        response = httpx.post(
            FILESCAN_URL,
            files={"file": (upload.name, upload.file)},
            timeout=10.0,
        )
    except httpx.RequestError as exc:
        raise FilescanError(f"Could not reach filescan service: {exc}") from exc

    if response.status_code != 200:
        raise FilescanError(
            f"Filescan returned {response.status_code}: {response.text}"
        )

    return response.json()
