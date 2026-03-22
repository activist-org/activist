# SPDX-License-Identifier: AGPL-3.0-or-later

import asyncio


async def scan_with_csam(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Async wrapper that scans file bytes for CSAM in a worker thread.
    Currently stubbed to always return clean.
    """
    return await asyncio.to_thread(_scan_with_csam_sync, file_bytes)


def _scan_with_csam_sync(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Synchronous implementation used by the async wrapper above and unit tests.

    Scan file bytes for CSAM.

    Stub: always returns clean.

    Intended to be wired to an approved API service.
    Returns (detected, detail, signature_or_none). Raises RuntimeError if unavailable.
    """
    # TODO: Integrate with approved CSAM API service.
    return (False, "No CSAM detected.", None)
