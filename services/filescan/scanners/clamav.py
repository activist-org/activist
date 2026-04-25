# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Methods for the ClamAV file scanner.
"""

import asyncio
import io
import os

from clamav_client.clamd import ClamdUnixSocket

# Socket path must match clamd.conf (and entrypoint.sh). Default matches Alpine.
CLAMAV_SOCKET = os.environ.get("CLAMAV_SOCKET_PATH", "/run/clamav/clamd.sock")


async def scan_with_clamav(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Async wrapper that scans file bytes with ClamAV in a worker thread.

    Parameters
    ----------
    file_bytes : bytes
        The bytes of a file to be scanned with ClamAV.

    Returns
    -------
    tuple[bool, str, str | None]
        A tuple of (malware detected, detail, signature or none).

    Raises
    ------
    RuntimeError
        If the ClamAV daemon is unavailable.
    """
    return await asyncio.to_thread(_scan_with_clamav_sync, file_bytes)


def _scan_with_clamav_sync(file_bytes: bytes) -> tuple[bool, str, str | None]:
    """
    Implementation used by the async wrapper to scan file bytes with ClamAV as well as unit tests.

    Parameters
    ----------
    file_bytes : bytes
        The bytes of a file to be scanned with ClamAV.

    Returns
    -------
    tuple[bool, str, str | None]
        A tuple of (malware detected, detail, signature or none).

    Raises
    ------
    RuntimeError
        If the ClamAV daemon is unavailable.
    """
    client = ClamdUnixSocket(CLAMAV_SOCKET)

    try:
        # clamav-client returns the daemon reply (typically "PONG") on success.
        if not client.ping().startswith("PONG"):
            raise RuntimeError("ClamAV daemon is not responding to ping()")

    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Unable to connect to ClamAV daemon: {exc}") from exc

    try:
        # INSTREAM scan: empty dict means clean; otherwise values are (status, signature).
        result = client.instream(io.BytesIO(file_bytes))

    except Exception as exc:  # noqa: BLE001
        raise RuntimeError(f"Unable to connect to ClamAV daemon: {exc}") from exc

    if not result:
        return (False, "No malware detected by ClamAV.", None)

    _, (status, signature) = next(iter(result.items()))
    malware_detected = status == "FOUND"
    detail = (
        "Malware detected by ClamAV." if malware_detected else "Unexpected scan status."
    )
    return (malware_detected, detail, signature)
