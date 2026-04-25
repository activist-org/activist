# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Methods for the CSAM file scanner.

Note: This scanner is a stub placeholder to demonstrate how the filescan service can be expanded.
Attn: The result of this scan is always "No CSAM detected.".
"""

import asyncio


async def scan_with_csam(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Async wrapper that scans file bytes for CSAM in a worker thread.

    Parameters
    ----------
    file_bytes : bytes
        The bytes of a file to be scanned with CSAM.

    Returns
    -------
    tuple[bool, str, str | None]
        A tuple of (malware detected, detail, signature or None).

    Notes
    -----
    - Currently stubbed to always return clean.
    """
    return await asyncio.to_thread(_scan_with_csam_sync, file_bytes)


def _scan_with_csam_sync(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Implementation used by the async wrapper to scan file bytes for CSAM as well as unit tests.

    Parameters
    ----------
    file_bytes : bytes
        The bytes of a file to be scanned with CSAM.

    Returns
    -------
    tuple[bool, str, str | None]
        A tuple of (malware detected, detail, signature or None).

    Notes
    -----
    - Currently stubbed to always return clean.
    - Intended to be wired to an approved API service.
    """
    return (False, "No CSAM detected.", None)
