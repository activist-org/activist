# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for updating event details (orgs, times, location).
"""

import datetime

import pytest
from django.test import Client
from rest_framework import status

from communities.organizations.factories import OrganizationFactory
from events.factories import EventFactory, EventTimeFactory
from events.models import EventTime

pytestmark = pytest.mark.django_db


def test_event_update_orgs_owner_ok_200(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory.create(created_by=user)
    new_org = OrganizationFactory.create()

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"orgs": [str(new_org.id)]},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    event.refresh_from_db()
    assert list(event.orgs.values_list("id", flat=True)) == [new_org.id]


def test_event_update_times_owner_ok_200(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory.create(created_by=user, times=[])
    start = datetime.datetime(2026, 6, 10, 10, 0, tzinfo=datetime.timezone.utc)
    end = datetime.datetime(2026, 6, 10, 12, 0, tzinfo=datetime.timezone.utc)

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={
            "times": [
                {
                    "all_day": False,
                    "start_time": start.isoformat().replace("+00:00", "Z"),
                    "end_time": end.isoformat().replace("+00:00", "Z"),
                }
            ]
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    event.refresh_from_db()
    assert event.times.count() == 1
    event_time = event.times.first()
    assert event_time is not None
    assert event_time.start_time == start
    assert event_time.end_time == end


def test_event_update_replaces_old_times(authenticated_client) -> None:
    client, user = authenticated_client
    old_time = EventTimeFactory.create()
    event = EventFactory.create(created_by=user, times=[old_time])
    old_time_id = old_time.id
    start = datetime.datetime(2026, 7, 1, 9, 0, tzinfo=datetime.timezone.utc)
    end = datetime.datetime(2026, 7, 1, 11, 0, tzinfo=datetime.timezone.utc)

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={
            "times": [
                {
                    "all_day": False,
                    "start_time": start.isoformat().replace("+00:00", "Z"),
                    "end_time": end.isoformat().replace("+00:00", "Z"),
                }
            ]
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert not EventTime.objects.filter(id=old_time_id).exists()
    event.refresh_from_db()
    assert event.times.count() == 1


def test_event_update_online_location_link_owner_ok_200(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory.create(created_by=user, location_type="online")

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"online_location_link": "https://example.com/meet"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    event.refresh_from_db()
    assert event.online_location_link == "https://example.com/meet"


def test_event_update_physical_location_owner_ok_200(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory.create(created_by=user, location_type="physical")

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={
            "location": {
                "address_or_name": "Brandenburg Gate",
                "city": "Berlin",
                "country_code": "DE",
                "lat": "52.516275",
                "lon": "13.377704",
                "bbox": ["52.51", "13.37", "52.52", "13.38"],
            }
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    event.refresh_from_db()
    assert event.physical_location is not None
    assert event.physical_location.address_or_name == "Brandenburg Gate"
    assert event.physical_location.city == "Berlin"


def test_event_update_invalid_org_bad_request_400(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory.create(created_by=user)

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"orgs": ["00000000-0000-0000-0000-000000000000"]},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_event_update_unauthenticated_unauthorized_401(client: Client) -> None:
    event = EventFactory.create()

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"name": "updated_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
