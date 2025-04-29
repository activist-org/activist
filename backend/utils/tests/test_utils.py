# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Unit tests for the utilities.
"""

import pytest
from datetime import datetime, timedelta

from rest_framework.exceptions import ValidationError
from utils.utils import (
    validate_creation_and_deletion_dates,
    validate_creation_and_deprecation_dates,
)

pytestmark = pytest.mark.django_db


def test_validate_creation_and_deletion_dates_valid() -> None:
    """
    Test validate_creation_and_deletion_dates with valid dates.
    """
    creation_date = datetime.now()
    deletion_date = creation_date + timedelta(days=1)

    data = {
        "creation_date": creation_date,
        "deletion_date": deletion_date,
    }

    validate_creation_and_deletion_dates(data)


def test_validate_creation_and_deletion_dates_invalid() -> None:
    """
    Test validate_creation_and_deletion_dates with invalid date order.
    """
    creation_date = datetime.now()
    deletion_date = creation_date - timedelta(days=1)

    data = {
        "creation_date": creation_date,
        "deletion_date": deletion_date,
    }

    with pytest.raises(ValidationError) as exc:
        validate_creation_and_deletion_dates(data)

    assert "deletion_date cannot be before creation_date" in str(exc.value)


def test_validate_creation_and_deprecation_dates_valid() -> None:
    """
    Test validate_creation_and_deprecation_dates with valid dates.
    """
    creation_date = datetime.now()
    deprecation_date = creation_date + timedelta(days=2)

    data = {
        "creation_date": creation_date,
        "deprecation_date": deprecation_date,
    }

    validate_creation_and_deprecation_dates(data)


def test_validate_creation_and_deprecation_dates_invalid() -> None:
    """
    Test validate_creation_and_deprecation_dates with invalid date order.
    """
    creation_date = datetime.now()
    deprecation_date = creation_date - timedelta(days=3)

    data = {
        "creation_date": creation_date,
        "deprecation_date": deprecation_date,
    }

    with pytest.raises(ValidationError) as exc:
        validate_creation_and_deprecation_dates(data)

    assert "deprecation_date cannot be before creation_date" in str(exc.value)
