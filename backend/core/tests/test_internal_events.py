# SPDX-License-Identifier: AGPL-3.0-or-later

import json
from typing import Any, Dict

import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def _base_envelope() -> Dict[str, Any]:
    return {
        "type": "malware_quarantined",
        "occurred_at": "2026-03-17T12:34:56Z",
        "source": "clamav",
        "severity": "high",
        "producer": "filescan",
        "payload": {
            "filename": "eicar.txt",
            "quarantine_id": "abc123",
            "signature": "EICAR-TEST",
            "detail": "Malware detected by ClamAV.",
            "detected_by": "clamav",
        },
    }


def test_security_events_ingest_rejects_without_token(
    api_client: APIClient, settings
) -> None:
    settings.INTERNAL_EVENTS_TOKEN = "secret-token"
    envelope = _base_envelope()

    response = api_client.post(
        "/internal/security-events",
        data=json.dumps(envelope),
        content_type="application/json",
    )

    assert response.status_code == 403


def test_security_events_ingest_sends_email_for_malware_quarantined(
    api_client: APIClient, settings, monkeypatch
) -> None:
    settings.INTERNAL_EVENTS_TOKEN = "secret-token"
    settings.SECURITY_ALERT_RECIPIENTS = ("ops@example.com",)
    settings.SECURITY_ALERT_FROM_EMAIL = "alerts@example.com"

    sent: Dict[str, Any] = {}

    def fake_send_mail(
        subject: str,
        message: str,
        from_email: str,
        recipient_list,
        fail_silently: bool = False,
    ) -> int:
        sent["subject"] = subject
        sent["message"] = message
        sent["from_email"] = from_email
        sent["recipient_list"] = list(recipient_list)
        return 1

    monkeypatch.setattr("core.internal_events.send_mail", fake_send_mail)

    envelope = _base_envelope()

    response = api_client.post(
        "/internal/security-events",
        data=json.dumps(envelope),
        content_type="application/json",
        HTTP_X_INTERNAL_TOKEN="secret-token",
    )

    assert response.status_code == 204
    assert sent["from_email"] == "alerts@example.com"
    assert "eicar.txt" in sent["message"]
    assert "abc123" in sent["message"]
    assert sent["recipient_list"] == ["ops@example.com"]
