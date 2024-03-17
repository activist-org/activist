import re
from typing import Any

from django.utils.translation import gettext as _
from rest_framework import serializers


def validate_creation_and_deletion_dates(data: Any) -> None:
    if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", data["creation_date"]):
        raise serializers.ValidationError(
            _("Invalid creation_date format. It needs to be in ISO format."),
            code="invalid_creation_date",
        )

    if data["creation_date"] < data["deletion_date"]:
        raise serializers.ValidationError(
            _("The field deletion_date cannot be before creation_date."),
            code="invalid_date_order",
        )


def validate_creation_and_deprecation_dates(data: Any) -> None:
    if data["deprecation_date"] < data["creation_date"]:
        raise serializers.ValidationError(
            _("The field deprecation_date cannot be before creation_date."),
            code="invalid_date_order",
        )


def validate_flags_number(data: Any) -> None:
    if int(data["total_flags"]) < 0:
        raise serializers.ValidationError(
            _("The field total_flags cannot be negative."),
            code="negative_total_flags",
        )


def validate_empty(value: Any, field_name: Any) -> None:
    if value == "" or value is None:
        raise serializers.ValidationError(
            _(f"The field {field_name} has to be filled."), code="empty_field"
        )


def validate_object_existence(model: Any, object_id: Any) -> None:
    if model.objects.filter(id=object_id).exists():
        raise serializers.ValidationError(
            _(f"There is no {model.__name__} object with id {object_id}."),
            code="inexistent_object",
        )
