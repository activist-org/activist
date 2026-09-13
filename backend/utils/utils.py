# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Utility functions for date formatting and logic validation as well as other common operations.
"""

import logging
from typing import Any, TypeVar

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Manager, Model
from rest_framework import serializers

logger = logging.getLogger(__name__)

ModelT = TypeVar("ModelT", bound=Model)


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
            f"deletion_date ({data.get('deletion_date')}) is before creation_date ({data['creation_date']})"
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
            f"deprecation_date ({data.get('deprecation_date')}) is before creation_date ({data['creation_date']})"
        )
        raise serializers.ValidationError(
            ("The field deprecation_date cannot be before creation_date."),
            code="invalid_date_order",
        )


def validate_object_exists(
    manager: "Manager[ModelT]", value: "ModelT | Any", not_found_message: str
) -> ModelT:
    """
    Validate that a related object exists.

    Accepts either an already-resolved model instance or an id/UUID/string
    primary key. This centralizes a pattern that was previously duplicated
    across several serializers (e.g. validating that a referenced Event
    exists).

    Parameters
    ----------
    manager : Manager[ModelT]
        The model manager to query against, e.g. ``Event.objects``.
    value : ModelT | Any
        Either an already-resolved model instance, or an id to look up.
    not_found_message : str
        The error message to raise if no matching object is found.

    Returns
    -------
    ModelT
        The validated model instance.

    Raises
    ------
    ValidationError
        If no object matching the given id exists.
    """
    model_cls = manager.model

    if isinstance(value, model_cls):
        return value

    try:
        obj = manager.get(id=value)
        logger.info(f"{model_cls.__name__} found for value: {value}")

    except ObjectDoesNotExist as e:
        raise serializers.ValidationError(not_found_message) from e

    return obj
