import re
from rest_framework import serializers
from django.utils.translation import gettext as _



def validate_creation_and_deletion_dates(data):
    if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$", data["creation_date"]):
        raise serializers.ValidationError(
            _("Invalid creation_date format, nees to be in ISO format."),
            code = "invalid_creation_date",
        )

    if data["creation_date"] < data["deletion_date"]:
        raise serializers.ValidationError(
            _("Deletion date cannot be before creation date."),
            code = "date_order",
        )


def validate_creation_and_deprecation_dates(data):
    if data["deprecation_date"] < data["creation_date"]:
        raise serializers.ValidationError(
            _("Deprecation date cannot be before creation date."),
            code = "date_order",
        )

def validate_flags_number(data):
    if int(data["total_flags"]) < 0:
        raise serializers.ValidationError(
            _("Total flags cannot be negative."),
            code = "negative_total_flags",
        )


def validate_empty(value, field_name):
    if value == "" or value is None:
        raise serializers.ValidationError(
            _("Invalid value: %(field_name)s"),
            code = "invalid_value",
            params={"field_name": field_name},
        )


def validate_object_existence(model, object_id):
    if model.objects.filter(id=object_id).exists():
        raise serializers.ValidationError(
            _("There is no %(model_name)s object with id %(object_id)s."),
            code = "inexistent_object",
            params={"model_name": model.__name__, "object_id": object_id},
        )
