# SPDX-License-Identifier: AGPL-3.0-or-later
"""
View-layer helper: scan uploads and rewind on success.
"""

from collections.abc import Iterable

from django.core.files.uploadedfile import UploadedFile
from rest_framework import status
from rest_framework.response import Response

from core.filescan.filescan_client import FilescanError, scan_file

# User-facing messages for scan failures.
FILESCAN_MSG_REJECTED = "The uploaded file was rejected by the security scan."
FILESCAN_MSG_COULD_NOT_SCAN = "The file could not be scanned. Please try again later."


def scan_uploads_and_rewind(uploads: Iterable[UploadedFile]) -> Response | None:
    """
    Scan uploads; return 400 Response on malware/scan error, else rewind and return None.

    Parameters
    ----------
    uploads : list
        List of uploaded file objects to scan.

    Returns
    -------
    Response or None
        None if all scans pass (and uploads are rewound); otherwise a 400 Response.
        Caller can then safely pass request.data to the serializer when None.
    """
    if not uploads:
        return None

    try:
        for upload in uploads:
            result = scan_file(upload)
            if result.get("malware_detected"):
                return Response(
                    {"nonFieldErrors": [FILESCAN_MSG_REJECTED]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        for upload in uploads:
            upload.seek(0)

        return None

    except FilescanError:
        return Response(
            {"nonFieldErrors": [FILESCAN_MSG_COULD_NOT_SCAN]},
            status=status.HTTP_400_BAD_REQUEST,
        )
