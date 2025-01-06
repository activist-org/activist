"""
Serializers for the events app.
"""

from typing import Any, Dict, Union

from django.utils.dateparse import parse_datetime
from django.utils.translation import gettext as _
from rest_framework import serializers

from content.serializers import LocationSerializer, ResourceSerializer
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
)

from .models import (
    Event,
    EventText,
    Format,
)

# MARK: Main Tables


class EventTextSerializer(serializers.ModelSerializer[EventText]):
    class Meta:
        model = EventText
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer[Event]):
    texts = EventTextSerializer()
    offline_location = LocationSerializer(read_only=True)
    resources = ResourceSerializer(many=True, read_only=True)

    class Meta:
        model = Event

        extra_kwargs = {
            "created_by": {"read_only": True},
        }

        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        if parse_datetime(data["start_time"]) > parse_datetime(data["end_time"]):  # type: ignore
            raise serializers.ValidationError(
                _("The start time cannot be after the end time."),
                code="invalid_time_order",
            )

        validate_creation_and_deletion_dates(data)

        if data.get("terms_checked") is False:
            raise serializers.ValidationError(
                "You must accept the terms of service to create an event."
            )

        return data

    def create(self, validated_data: dict[str, Any]) -> Event:
        event = Event.objects.create(**validated_data)

        if event:
            EventText.objects.create(event=event)

        return event


class FormatSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Format
        fields = "__all__"

    def validate(self, data: Dict[str, Union[str, int]]) -> Dict[str, Union[str, int]]:
        validate_creation_and_deprecation_dates(data)

        return data
