# SPDX-License-Identifier: AGPL-3.0-or-later

from scanners.csam import csam


def test_scan_with_csam_stub_always_clean() -> None:
    """
    Tests for the CSAM scanner.
    """
    detected, detail, signature = csam._scan_with_csam_sync(b"any-bytes-here")

    assert detected is False
    assert detail == "No CSAM detected."
    assert signature is None
