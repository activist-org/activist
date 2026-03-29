# SPDX-License-Identifier: AGPL-3.0-or-later

import asyncio
import os

import pyclamd

# Socket path must match clamd.conf (and entrypoint.sh). Default matches Alpine.
CLAMAV_SOCKET = os.environ.get("CLAMAV_SOCKET_PATH", "/run/clamav/clamd.sock")


async def scan_with_clamav(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Async wrapper that scans file bytes with ClamAV in a worker thread.

    Returns
    -------
    tuple[bool, str, str | None]
        malware_detected, detail, signature_or_none

    Raises
    ------
    RuntimeError
        If the ClamAV daemon is unavailable.
    """
    return await asyncio.to_thread(_scan_with_clamav_sync, file_bytes)


def _scan_with_clamav_sync(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Synchronous implementation used by the async wrapper above and unit tests.
    """
    # Create a connection to the ClamAV daemon.
    client = pyclamd.ClamdUnixSocket(CLAMAV_SOCKET)

    try:
        if not client.ping():
            raise RuntimeError("ClamAV daemon is not responding to ping()")

    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Unable to connect to ClamAV daemon: {exc}") from exc

    # scan_stream returns None (clean) or e.g. {"stream": ("FOUND", "Eicar-Test-Signature")}.
    result = client.scan_stream(file_bytes)

    if not result:
        return (False, "No malware detected by ClamAV.", None)

    status, signature = result["stream"]
    malware_detected = status == "FOUND"
    detail = (
        "Malware detected by ClamAV." if malware_detected else "Unexpected scan status."
    )
    return (malware_detected, detail, signature)
