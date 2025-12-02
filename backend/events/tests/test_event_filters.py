# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for event list filtering: days_ahead
"""

from datetime import datetime, timedelta
from datetime import timezone as dt_timezone
from unittest.mock import patch

import pytest
from rest_framework.test import APIClient

from events.factories import EventFactory

pytestmark = pytest.mark.django_db

EVENTS_URL = "/v1/events/events"

FIXED_NOW = datetime(2025, 11, 20, 12, 0, tzinfo=dt_timezone.utc)


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_filters_events_within_window(mock_now) -> None:
    """
    days_ahead returns only events starting between now and now + N days.
    """
    client = APIClient()

    # Within the 10 day window.
    event_in_window = EventFactory.create(
        start_time=FIXED_NOW + timedelta(days=5),
        end_time=FIXED_NOW + timedelta(days=5, hours=2),
    )

    # Before now (past).
    event_in_past = EventFactory.create(
        start_time=FIXED_NOW - timedelta(days=1),
        end_time=FIXED_NOW - timedelta(hours=20),
    )

    # After the window.
    event_after_window = EventFactory.create(
        start_time=FIXED_NOW + timedelta(days=15),
        end_time=FIXED_NOW + timedelta(days=15, hours=2),
    )

    response = client.get(f"{EVENTS_URL}?days_ahead=10")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert str(event_in_window.id) in ids
    assert str(event_in_past.id) not in ids
    assert str(event_after_window.id) not in ids


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_with_type_and_setting_combination(mock_now) -> None:
    """
    days_ahead works in combination with other filters (type, setting).
    """
    client = APIClient()

    event_match = EventFactory.create(
        type="learn",
        setting="online",
        start_time=FIXED_NOW + timedelta(days=3),
        end_time=FIXED_NOW + timedelta(days=3, hours=2),
    )

    # Wrong type.
    EventFactory.create(
        type="action",
        setting="online",
        start_time=FIXED_NOW + timedelta(days=3),
        end_time=FIXED_NOW + timedelta(days=3, hours=2),
    )

    # Wrong setting.
    EventFactory.create(
        type="learn",
        setting="offline",
        start_time=FIXED_NOW + timedelta(days=3),
        end_time=FIXED_NOW + timedelta(days=3, hours=2),
    )

    # Outside days_ahead window.
    EventFactory.create(
        type="learn",
        setting="online",
        start_time=FIXED_NOW + timedelta(days=20),
        end_time=FIXED_NOW + timedelta(days=20, hours=2),
    )

    response = client.get(
        f"{EVENTS_URL}?days_ahead=10&type=learn&setting=online",
    )
    assert response.status_code == 200

    results = response.data["results"]
    ids = {item["id"] for item in results}

    assert str(event_match.id) in ids
    # Only the matching event should pass all filters.
    assert len(results) == 1


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_ignores_non_positive_values(mock_now) -> None:
    """
    Non-positive days_ahead (0 or negative) should not crash and should behave
    like an empty or immediate window (only events starting at now for 0).
    Here we assert call succeeds and only the exact-now event is included for 0.
    """
    client = APIClient()

    # Event exactly at now.
    event_now = EventFactory.create(
        start_time=FIXED_NOW,
        end_time=FIXED_NOW + timedelta(hours=2),
    )

    # Event in future.
    event_future = EventFactory.create(
        start_time=FIXED_NOW + timedelta(days=1),
        end_time=FIXED_NOW + timedelta(days=1, hours=2),
    )

    response = client.get(f"{EVENTS_URL}?days_ahead=0")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert str(event_now.id) in ids
    assert str(event_future.id) not in ids
