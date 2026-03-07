# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for event list filtering: days_ahead
"""

import uuid
from datetime import datetime, timedelta
from datetime import timezone as dt_timezone
from unittest.mock import patch

import pytest
from rest_framework.test import APIClient

from events.factories import EventFactory, EventTimeFactory

pytestmark = pytest.mark.django_db

EVENTS_URL = "/v1/events/events"
FIXED_NOW = datetime(1970, 1, 1, 0, 0, tzinfo=dt_timezone.utc)


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_filters_events_within_window(mock_now) -> None:
    """
    days_ahead returns only events starting between now and now + N days.
    """
    client = APIClient()

    # Within the 10 day window.
    event_in_window = EventFactory.create(
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=5),
                end_time=FIXED_NOW + timedelta(days=5, hours=2),
            )
        ]
    )

    # Before now (past).
    event_in_past = EventFactory.create(
        times=[
            EventTimeFactory.create(
                start_time=FIXED_NOW - timedelta(days=1),
                end_time=FIXED_NOW - timedelta(hours=20),
            )
        ]
    )

    # After the window.
    event_after_window = EventFactory.create(
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=15),
                end_time=FIXED_NOW + timedelta(days=15, hours=2),
            )
        ]
    )

    response = client.get(f"{EVENTS_URL}?days_ahead=10")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert str(event_in_window.id) in ids
    assert str(event_in_past.id) not in ids
    assert str(event_after_window.id) not in ids


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_rolling_24h_window(mock_now) -> None:
    """
    days_ahead=1 includes events within the next 24 hours, and excludes events
    just beyond that window.
    """
    client = APIClient()

    # Inside 1-day window (now + 23 hours).
    event_inside = EventFactory.create(
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(hours=21),
                end_time=FIXED_NOW + timedelta(hours=23),
            )
        ]
    )

    # Just outside 1-day window (now + 25 hours).
    event_outside = EventFactory(
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(hours=25),
                end_time=FIXED_NOW + timedelta(hours=27),
            )
        ]
    )

    response = client.get(f"{EVENTS_URL}?days_ahead=1")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert str(event_inside.id) in ids
    assert str(event_outside.id) not in ids


@patch("django.utils.timezone.now", return_value=FIXED_NOW)
def test_days_ahead_with_type_and_location_type_combination(mock_now) -> None:
    """
    days_ahead works in combination with other filters (type, location_type).
    """
    client = APIClient()

    event_match = EventFactory.create(
        type="learn",
        location_type="online",
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=3),
                end_time=FIXED_NOW + timedelta(days=3, hours=2),
            )
        ],
    )

    # Wrong type.
    EventFactory(
        type="action",
        location_type="physical",
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=3),
                end_time=FIXED_NOW + timedelta(days=3, hours=2),
            )
        ],
    )

    # Wrong location_type.
    EventFactory(
        type="learn",
        location_type="physical",
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=3),
                end_time=FIXED_NOW + timedelta(days=3, hours=2),
            )
        ],
    )

    # Outside days_ahead window.
    EventFactory(
        type="learn",
        location_type="online",
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW + timedelta(days=20),
                end_time=FIXED_NOW + timedelta(days=20, hours=2),
            )
        ],
    )

    response = client.get(
        f"{EVENTS_URL}?days_ahead=10&type=learn&location_type=online",
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
    event_now = EventFactory(
        times=[
            EventTimeFactory(
                start_time=FIXED_NOW,
                end_time=FIXED_NOW + timedelta(hours=2),
            )
        ]
    )

    # Event in future.
    event_future = EventFactory.create()

    response = client.get(f"{EVENTS_URL}?days_ahead=0")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert str(event_now.id) in ids
    assert str(event_future.id) not in ids


def test_filter_id_handles_single_id() -> None:
    """
    A single valid uuid passed as an id parameter
    should filter down to the single event with the same id field.
    """
    client = APIClient()
    uuid_target = uuid.uuid4()
    uuid_filler = uuid.uuid4()

    # Event with target test uuid.
    event_target = EventFactory(id=uuid_target)
    # Event with non target test uuid.
    event_filler = EventFactory(id=uuid_filler)

    response = client.get(f"{EVENTS_URL}?id={uuid_target}")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert ids == {str(event_target.id)}
    assert str(event_filler.id) not in ids


def test_filter_id_handles_multiple_separate_ids() -> None:
    """
    Multiple valid uuids each passed as individual id parameters
    should filter down to the events with the same id fields.
    """
    client = APIClient()
    uuid_target_1 = uuid.uuid4()
    uuid_target_2 = uuid.uuid4()
    uuid_target_3 = uuid.uuid4()

    uuid_filler_1 = uuid.uuid4()
    uuid_filler_2 = uuid.uuid4()

    # Events with target test uuids.
    event_target_1 = EventFactory(id=uuid_target_1)
    event_target_2 = EventFactory(id=uuid_target_2)
    event_target_3 = EventFactory(id=uuid_target_3)
    # Events with non target test uuids.
    event_filler_1 = EventFactory(id=uuid_filler_1)
    event_filler_2 = EventFactory(id=uuid_filler_2)

    response = client.get(
        f"{EVENTS_URL}?id={uuid_target_1}&id={uuid_target_2}&id={uuid_target_3}"
    )
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert ids == {
        str(event_target_1.id),
        str(event_target_2.id),
        str(event_target_3.id),
    }

    assert str(event_filler_1.id) not in ids
    assert str(event_filler_2.id) not in ids


def test_filter_id_handles_multiple_listed_ids() -> None:
    """
    Multiple valid uuids passed as a coma separated string
    in a single id parameter should filter down to the events
    with the same id fields.
    """
    client = APIClient()
    uuid_target_1 = uuid.uuid4()
    uuid_target_2 = uuid.uuid4()
    uuid_target_3 = uuid.uuid4()

    uuid_filler_1 = uuid.uuid4()
    uuid_filler_2 = uuid.uuid4()

    # Events with target test uuids.
    event_target_1 = EventFactory(id=uuid_target_1)
    event_target_2 = EventFactory(id=uuid_target_2)
    event_target_3 = EventFactory(id=uuid_target_3)
    # Events with non target test uuids.
    event_filler_1 = EventFactory(id=uuid_filler_1)
    event_filler_2 = EventFactory(id=uuid_filler_2)

    response = client.get(
        f"{EVENTS_URL}?id={uuid_target_1},{uuid_target_2},{uuid_target_3}"
    )
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert ids == {
        str(event_target_1.id),
        str(event_target_2.id),
        str(event_target_3.id),
    }

    assert str(event_filler_1.id) not in ids
    assert str(event_filler_2.id) not in ids


def test_filter_id_handles_nonexistent_uuid() -> None:
    """
    Uuids that are not present in the backend data
    should be ignored and any existing uuids given
    should still be matched to events with the same id field.
    """
    client = APIClient()

    uuid_nonexistent = uuid.uuid4()

    uuid_target = uuid.uuid4()

    uuid_filler = uuid.uuid4()

    # Events with target test uuids.
    event_target = EventFactory(id=uuid_target)
    # Events with non target test uuids.
    event_filler = EventFactory(id=uuid_filler)

    # remove last 3 characters of 'uuid_target_2' to invalidate
    response = client.get(f"{EVENTS_URL}?id={uuid_target}&id={uuid_nonexistent}")
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert ids == {str(event_target.id)}

    assert str(event_filler.id) not in ids


def test_filter_id_handles_invalid_uuid() -> None:
    """
    Invalid uuids should be ignored and any valid uuids given
    should still be matched to events with the same id field.
    """
    client = APIClient()
    uuid_target_1 = uuid.uuid4()
    uuid_target_2 = uuid.uuid4()

    uuid_filler = uuid.uuid4()

    # Events with target test uuids.
    event_target_1 = EventFactory(id=uuid_target_1)
    event_target_2 = EventFactory(id=uuid_target_2)
    # Events with non target test uuids.
    event_filler = EventFactory(id=uuid_filler)

    # remove last 3 characters of 'uuid_target_2' to invalidate
    response = client.get(
        f"{EVENTS_URL}?id={uuid_target_1}&id={str(uuid_target_2)[:-3]}"
    )
    assert response.status_code == 200

    ids = {item["id"] for item in response.data["results"]}

    assert ids == {str(event_target_1.id)}

    assert str(event_target_2.id) not in ids
    assert str(event_filler.id) not in ids
