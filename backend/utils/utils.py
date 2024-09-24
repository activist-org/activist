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

    if data.get("deletion_date") and data.get("deletion_date") < data["creation_date"]:
        raise serializers.ValidationError(
            _("The field deletion_date cannot be before creation_date."),
            code="invalid_date_order",
        )


def validate_creation_and_deprecation_dates(data: Any) -> None:
    if (
        data.get("deprecation_date")
        and data.get("deprecation_date") < data["creation_date"]
    ):
        raise serializers.ValidationError(
            _("The field deprecation_date cannot be before creation_date."),
            code="invalid_date_order",
        )
