# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for the CSAM scanner.

Note: This scanner is a stub placeholder to demonstrate how the filescan service can be expanded.
Attn: The result of this scan is always "No CSAM detected.".
"""

from scanners import csam


def test_scan_with_csam_stub_always_clean() -> None:
    """
    Tests for the CSAM scanner.
    """
    detected, detail, signature = csam._scan_with_csam_sync(b"any-bytes-here")

    assert detected is False
    assert detail == "No CSAM detected."
    assert signature is None
