# SPDX-License-Identifier: AGPL-3.0-or-later
"""Filescan client package. Re-export the public API."""

from core.filescan.filescan_client import FilescanError, scan_file
from core.filescan.scan_helpers import scan_uploads_and_rewind

__all__ = ["FilescanError", "scan_file", "scan_uploads_and_rewind"]
