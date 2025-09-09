# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Utility functions for date formatting and logic validation as well as other common operations.
"""

import logging
from typing import Any

from rest_framework import serializers

logger = logging.getLogger(__name__)


def validate_creation_and_deletion_dates(data: Any) -> None:
    """
    Validate creation and deletion dates for format and logical order.

    Parameters
    ----------
    data : Any
        Input data dictionary that should contain the following keys:
        - creation_date: The date when the object was created (ISO format).
        - deletion_date: Optional date when the object was deleted.

    Raises
    ------
    ValidationError
        If creation_date format is invalid or if deletion_date
        is before creation_date.
    """

    if data.get("deletion_date") and data.get("deletion_date") < data["creation_date"]:
        logger.error(
            "deletion_date (%s) is before creation_date (%s)",
            data.get("deletion_date"),
            data["creation_date"],
        )
        raise serializers.ValidationError(
            ("The field deletion_date cannot be before creation_date."),
            code="invalid_date_order",
        )


def validate_creation_and_deprecation_dates(data: Any) -> None:
    """
    Validate that the deprecation date is not before the creation date.

    Parameters
    ----------
    data : Any
        Input data dictionary that should contain the following keys:
        - creation_date: The date when the object was created.
        - deprecation_date: The date when the object was deprecated.

    Raises
    ------
    ValidationError
        If deprecation_date is before creation_date.
    """

    if (
        data.get("deprecation_date")
        and data.get("creation_date")
        and data.get("deprecation_date") < data.get("creation_date")
    ):
        logger.error(
            "deprecation_date (%s) is before creation_date (%s)",
            data.get("deprecation_date"),
            data["creation_date"],
        )
        raise serializers.ValidationError(
            ("The field deprecation_date cannot be before creation_date."),
            code="invalid_date_order",
        )
