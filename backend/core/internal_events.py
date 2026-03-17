# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Internal endpoint to ingest security events (e.g. malware_quarantined) from filescan.
"""

from __future__ import annotations

import logging
from typing import Any, Dict

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest
from django.utils.dateparse import parse_datetime
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

logger = logging.getLogger(__name__)


class SecurityEventIngestView(APIView):
    """
    Receive security events from internal services and dispatch notifications.
    """

    permission_classes = [AllowAny]

    def _authenticate(self, request: HttpRequest) -> bool:
        """
        Validate the internal token on the request.

        Parameters
        ----------
        request : HttpRequest
            The underlying Django HttpRequest from which to read headers.

        Returns
        -------
        bool
            True if the request provides a valid internal token, False otherwise.
        """
        expected = getattr(settings, "INTERNAL_EVENTS_TOKEN", None)
        if not expected:
            # If no token is configured, reject all external posts rather than silently accepting.
            logger.error("INTERNAL_EVENTS_TOKEN is not configured; rejecting request.")
            return False

        provided = request.headers.get("X-Internal-Token")
        if not provided or provided != expected:
            logger.warning("Invalid internal token provided for security event ingest.")
            return False
        return True

    def post(self, request: Request) -> Response:
        """
        Handle a posted security event envelope.

        Parameters
        ----------
        request : Request
            DRF Request containing the JSON security event envelope in its body.

        Returns
        -------
        Response
            A DRF Response with an appropriate status code:
            403 if unauthorized, 400 on validation errors, and 204 on success
            for supported event types.
        """
        if not self._authenticate(request._request):
            return Response(
                {"detail": "Unauthorized"},
                status=status.HTTP_403_FORBIDDEN,
            )

        body: Dict[str, Any] = request.data

        event_type = body.get("type")
        occurred_at = body.get("occurred_at")
        source = body.get("source")
        payload = body.get("payload")

        if (
            not isinstance(event_type, str)
            or not isinstance(source, str)
            or not isinstance(payload, dict)
        ):
            return Response(
                {"detail": "Invalid event envelope."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if occurred_at is None or parse_datetime(str(occurred_at)) is None:
            return Response(
                {"detail": "Invalid or missing occurred_at."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if event_type == "malware_quarantined":
            return self._handle_malware_quarantined(body, payload)

        logger.warning("Received unsupported security event type=%s", event_type)
        return Response(
            {"detail": "Unsupported event type."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def _handle_malware_quarantined(
        self,
        envelope: Dict[str, Any],
        payload: Dict[str, Any],
    ) -> Response:
        """
        Handle a malware_quarantined event and send an operator alert email.

        Parameters
        ----------
        envelope : dict of str to Any
            The full security event envelope, including top-level metadata such
            as ``type``, ``occurred_at``, and ``source``.
        payload : dict of str to Any
            The event payload containing malware-specific fields such as
            filename, quarantine_id, signature, detail, and detected_by.

        Returns
        -------
        Response
            A DRF Response indicating the outcome: 400 if required fields are
            missing, 500 if alert dispatch fails, and 204 when the alert email
            is sent successfully.
        """
        filename = payload.get("filename")
        quarantine_id = payload.get("quarantine_id")
        signature = payload.get("signature")
        detail = payload.get("detail")
        detected_by = payload.get("detected_by")

        if not filename or not quarantine_id:
            return Response(
                {"detail": "Missing filename or quarantine_id in payload."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        recipients = getattr(settings, "SECURITY_ALERT_RECIPIENTS", None)
        from_email = getattr(settings, "SECURITY_ALERT_FROM_EMAIL", None)

        if not recipients or not from_email:
            logger.error(
                "Security alert email configuration is incomplete; "
                "SECURITY_ALERT_RECIPIENTS or SECURITY_ALERT_FROM_EMAIL not set."
            )
            return Response(
                {"detail": "Security alert email configuration is incomplete."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        subject = "[activist] Malware quarantined"
        lines = [
            "A quarantined malware event was reported by the filescan service.",
            "",
            f"Filename: {filename}",
            f"Quarantine ID: {quarantine_id}",
            f"Detected by: {detected_by or envelope.get('source')}",
        ]
        if signature:
            lines.append(f"Signature: {signature}")
        if detail:
            lines.append(f"Detail: {detail}")
        occurred_at = envelope.get("occurred_at")
        if occurred_at:
            lines.append(f"Occurred at: {occurred_at}")

        message = "\n".join(lines)

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=from_email,
                recipient_list=list(recipients),
                fail_silently=False,
            )
        except Exception as exc:
            logger.error("Failed to send malware_quarantined alert email: %s", exc)
            return Response(
                {"detail": "Failed to dispatch security alert."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(
            "Dispatched malware_quarantined alert email for filename=%s quarantine_id=%s",
            filename,
            quarantine_id,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
