# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Standard EICAR anti-malware test file payload (68 bytes, no newline).

We do **not** commit ``eicar.txt`` in ``test_files/`` so repository malware
scanners do not block the repo. Tests build this payload in memory instead.

See https://www.eicar.org/download-anti-malware-testfile/
"""

from __future__ import annotations

import io


def eicar_test_bytes() -> bytes:
    """
    Return the canonical 68-byte EICAR test string.
    """
    return b"X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"


def eicar_test_fileobj() -> io.BytesIO:
    """
    Return a BytesIO suitable for multipart upload as ``eicar.txt``.
    """
    buf = io.BytesIO(eicar_test_bytes())
    buf.seek(0)
    return buf
