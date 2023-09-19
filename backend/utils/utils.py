import re

from django.utils.translation import gettext as _
from rest_framework import serializers


def validate_creation_and_deletion_dates(data):
    if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", data["creation_date"]):
        raise serializers.ValidationError(
            _("Invalid creation_date format. It needs to be in ISO format."),
            code="invalid_creation_date",
        )

    if data["creation_date"] < data["deletion_date"]:
        raise serializers.ValidationError(
            _("The field deletion_date cannot be before creation_date."),
            code="date_order",
        )


def validate_creation_and_deprecation_dates(data):
    if data["deprecation_date"] < data["creation_date"]:
        raise serializers.ValidationError(
            _("The field deprecation_date cannot be before creation_date."),
            code="date_order",
        )


def validate_flags_number(data):
    if int(data["total_flags"]) < 0:
        raise serializers.ValidationError(
            _("The field total_flags cannot be negative."),
            code="negative_total_flags",
        )


def validate_empty(value, field_name):
    if value == "" or value is None:
        raise serializers.ValidationError(
            _("The field %(field_name)s has to be filled."),
            code="invalid_value",
            params={"field_name": field_name},
        )


def validate_object_existence(model, object_id):
    if model.objects.filter(id=object_id).exists():
        raise serializers.ValidationError(
            _("There is no %(model_name)s object with id %(object_id)s."),
            code="inexistent_object",
            params={"model_name": model.__name__, "object_id": object_id},
        )
