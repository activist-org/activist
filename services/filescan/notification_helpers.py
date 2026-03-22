# SPDX-License-Identifier: AGPL-3.0-or-later

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from typing import Any

import httpx

logger = logging.getLogger(__name__)


def _build_malware_quarantined_envelope(event: dict[str, object]) -> dict[str, Any]:
    """
    Build a generic security event envelope for a malware_quarantined event.

    The envelope is intentionally generic so that other services and event
    types (e.g. CSAM detection) can reuse the same structure:

    {
        "type": "malware_quarantined",
        "occurred_at": "...",  # ISO-8601 UTC
        "source": "clamav",
        "severity": "high",
        "producer": "filescan",
        "payload": {
            "filename": "...",
            "quarantine_id": "...",
            "signature": "...",
            "detail": "...",
            "detected_by": "clamav",
            "content_type": "...",
            "size_bytes": 1234,
            "extra": {...}
        },
    }
    """
    filename = event.get("filename")
    quarantine_id = event.get("quarantine_id")
    signature = event.get("signature")
    source = event.get("source")
    detail = event.get("detail")
    content_type = event.get("content_type")
    size_bytes = event.get("size_bytes")
    extra = event.get("extra") if isinstance(event.get("extra"), dict) else None

    payload: dict[str, Any] = {
        "filename": filename,
        "quarantine_id": quarantine_id,
        "signature": signature,
        "detail": detail,
        "detected_by": source,
    }
    if content_type is not None:
        payload["content_type"] = content_type

    if size_bytes is not None:
        payload["size_bytes"] = size_bytes

    if extra is not None:
        payload["extra"] = extra

    envelope: dict[str, Any] = {
        "type": "malware_quarantined",
        "occurred_at": datetime.now(timezone.utc).isoformat(),
        "source": source,
        "severity": "high",
        "producer": "filescan",
        "payload": payload,
    }
    return envelope


def _post_security_event(envelope: dict[str, Any]) -> None:
    """
    Best-effort HTTP POST of a security event envelope to the backend.

    Reads configuration from environment at call time so that tests and
    different environments can control behaviour via:
        - FILESCAN_ALERTS_ENABLED
        - ALERTS_BACKEND_URL
        - ALERTS_BACKEND_TOKEN
    """
    alerts_enabled = os.getenv("FILESCAN_ALERTS_ENABLED", "false").lower() == "true"
    if not alerts_enabled:
        logger.info(
            "Security alerts disabled; not posting event type=%s", envelope.get("type")
        )
        return

    backend_url = os.getenv("ALERTS_BACKEND_URL")
    if not backend_url:
        logger.error(
            "ALERTS_BACKEND_URL is not configured; cannot post security event."
        )
        return

    headers: dict[str, str] = {"Content-Type": "application/json"}
    token = os.getenv("ALERTS_BACKEND_TOKEN")
    if token:
        headers["X-Internal-Token"] = token

    try:
        response = httpx.post(backend_url, json=envelope, headers=headers, timeout=5.0)
        if response.status_code >= 400:
            logger.error(
                "Failed to post security event type=%s status=%s body=%s",
                envelope.get("type"),
                response.status_code,
                response.text,
            )
        else:
            logger.info(
                "Posted security event type=%s status=%s",
                envelope.get("type"),
                response.status_code,
            )

    except httpx.RequestError as exc:
        logger.error(
            "Error posting security event type=%s error=%s", envelope.get("type"), exc
        )


def notify_malware_quarantined(event: dict[str, object]) -> None:
    """
    Hook for malware quarantine events.

    Logs the raw event and, when enabled via configuration, emits a generic
    security event envelope to the backend over HTTP so that the backend can
    fan-out notifications to operators or downstream systems.
    """
    logger.warning("malware quarantined event=%s.", event)

    try:
        envelope = _build_malware_quarantined_envelope(event)
    except Exception as exc:
        # Defensive: never let envelope building break scans.
        logger.error(
            "Failed to build malware_quarantined envelope error=%s event=%s", exc, event
        )
        return

    _post_security_event(envelope)
