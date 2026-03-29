# SPDX-License-Identifier: AGPL-3.0-or-later

from scanners.clamav import clamav


class _FakeClamdClient:
    def __init__(
        self,
        ping_ok: bool,
        scan_result: dict | None,
        ping_raises: Exception | None = None,
    ) -> None:
        self._ping_ok = ping_ok
        self._scan_result = scan_result
        self._ping_raises = ping_raises

    def ping(self) -> bool:
        if self._ping_raises is not None:
            raise self._ping_raises
        return self._ping_ok

    def scan_stream(self, data: bytes) -> dict | None:  # noqa: ARG002
        return self._scan_result


def _mock_clamd(monkeypatch, client: _FakeClamdClient) -> None:
    def _factory(_socket: str) -> _FakeClamdClient:  # noqa: ARG001
        return client

    monkeypatch.setattr("scanners.clamav.pyclamd.ClamdUnixSocket", _factory)


def test_scan_with_clamav_returns_clean_for_none_result(monkeypatch) -> None:
    client = _FakeClamdClient(ping_ok=True, scan_result=None)
    _mock_clamd(monkeypatch, client)

    detected, detail, signature = clamav._scan_with_clamav_sync(b"dummy-bytes")

    assert detected is False
    assert detail == "No malware detected by ClamAV."
    assert signature is None


def test_scan_with_clamav_detects_malware(monkeypatch) -> None:
    client = _FakeClamdClient(
        ping_ok=True,
        scan_result={"stream": ("FOUND", "Eicar-Test-Signature")},
    )
    _mock_clamd(monkeypatch, client)

    detected, detail, signature = clamav._scan_with_clamav_sync(b"dummy-bytes")

    assert detected is True
    assert detail == "Malware detected by ClamAV."
    assert signature == "Eicar-Test-Signature"


def test_scan_with_clamav_unexpected_status(monkeypatch) -> None:
    client = _FakeClamdClient(
        ping_ok=True,
        scan_result={"stream": ("WEIRD", "Some-Signature")},
    )
    _mock_clamd(monkeypatch, client)

    detected, detail, signature = clamav._scan_with_clamav_sync(b"dummy-bytes")

    assert detected is False
    assert detail == "Unexpected scan status."
    assert signature == "Some-Signature"


def test_scan_with_clamav_raises_when_ping_false(monkeypatch) -> None:
    client = _FakeClamdClient(ping_ok=False, scan_result=None)
    _mock_clamd(monkeypatch, client)

    try:
        clamav._scan_with_clamav_sync(b"dummy-bytes")

    except RuntimeError as exc:
        assert "ClamAV daemon is not responding to ping()" in str(exc)

    else:  # pragma: no cover - defensive
        assert False, "Expected RuntimeError when ping() returns False"


def test_scan_with_clamav_raises_when_ping_throws(monkeypatch) -> None:
    client = _FakeClamdClient(
        ping_ok=True, scan_result=None, ping_raises=Exception("boom")
    )
    _mock_clamd(monkeypatch, client)

    try:
        clamav._scan_with_clamav_sync(b"dummy-bytes")

    except RuntimeError as exc:
        assert "Unable to connect to ClamAV daemon" in str(exc)

    else:  # pragma: no cover - defensive
        assert False, "Expected RuntimeError when ping() raises"
