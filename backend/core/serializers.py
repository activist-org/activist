# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for internal core endpoints.
"""

from __future__ import annotations

from rest_framework import serializers


class SecurityEventPayloadSerializer(serializers.Serializer):
    """
    Define the payload shape for documentation and schema generation.

    This serializer is used primarily by drf-spectacular so that the
    ``SecurityEventIngestView`` can declare a ``serializer_class`` and be
    included correctly in the OpenAPI schema.
    """

    filename = serializers.CharField()
    quarantine_id = serializers.CharField()
    signature = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    detail = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )
    detected_by = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )


class SecurityEventEnvelopeSerializer(serializers.Serializer):
    """
    Describe the top-level security event envelope expected by the ingest view.

    The view performs its own runtime validation, but drf-spectacular requires
    a serializer to infer the request body schema; this class exists to satisfy
    that requirement.
    """

    type = serializers.CharField()
    occurred_at = serializers.DateTimeField()
    source = serializers.CharField()
    payload = SecurityEventPayloadSerializer()
