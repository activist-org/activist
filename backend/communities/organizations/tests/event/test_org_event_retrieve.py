# SPDX-License-Identifier: AGPL-3.0-or-later
from datetime import datetime

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIRequestFactory

from communities.organizations.factories import OrganizationFactory
from communities.organizations.views import OrganizationEventViewSet
from events.factories import EventFactory, EventTimeFactory

pytestmark = pytest.mark.django_db


def _test_org_event_retrieve_make_event(*, name: str, org):
    event = EventFactory.create(name=name, times=[])
    event.orgs.add(org)
    return event


def _test_org_event_retrieve_add_time(event, start_dt, end_dt):
    times = EventTimeFactory.create(
        start_time=start_dt,
        end_time=end_dt,
    )
    event.times.add(times)
    event.save()
    return event


def _test_org_event_retrieve_list(org_id, params=None):
    factory = APIRequestFactory()
    request = factory.get("/organizations/events/", data=params or {})
    view = OrganizationEventViewSet.as_view({"get": "list"})
    return view(request, org_id=org_id)


def test_org_event_retrieve_no_events_returns_empty_payload_ok_200():
    org = OrganizationFactory.create()
    response = _test_org_event_retrieve_list(org_id=org.id)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "count": 0,
        "next": None,
        "previous": None,
        "results": [],
    }


def test_org_event_retrieve_name_filter_icontains_ok_200():
    org = OrganizationFactory.create()
    keep = _test_org_event_retrieve_make_event(name="Community Cleanup", org=org)
    _test_org_event_retrieve_add_time(
        keep,
        timezone.make_aware(datetime(2026, 1, 10, 9, 0)),
        timezone.make_aware(datetime(2026, 1, 10, 11, 0)),
    )

    drop = _test_org_event_retrieve_make_event(name="Town Hall", org=org)
    _test_org_event_retrieve_add_time(
        drop,
        timezone.make_aware(datetime(2026, 1, 11, 9, 0)),
        timezone.make_aware(datetime(2026, 1, 11, 11, 0)),
    )

    response = _test_org_event_retrieve_list(org_id=org.id, params={"name": "clean"})

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids


def test_org_event_retrieve_start_and_end_overlap_filter_ok_200():
    org = OrganizationFactory.create()
    overlapping = _test_org_event_retrieve_make_event(name="Overlapping", org=org)
    _test_org_event_retrieve_add_time(
        overlapping,
        timezone.make_aware(datetime(2026, 1, 5, 10, 0)),
        timezone.make_aware(datetime(2026, 1, 12, 12, 0)),
    )

    outside = _test_org_event_retrieve_make_event(name="Outside", org=org)
    _test_org_event_retrieve_add_time(
        outside,
        timezone.make_aware(datetime(2026, 1, 21, 10, 0)),
        timezone.make_aware(datetime(2026, 1, 22, 12, 0)),
    )

    response = _test_org_event_retrieve_list(
        org_id=org.id,
        params={"start_date": "2026-01-10", "end_date": "2026-01-20"},
    )

    assert response.status_code == status.HTTP_200_OK

    returned_ids = {str(item["id"]) for item in response.data}
    assert str(overlapping.id) in returned_ids
    assert str(outside.id) not in returned_ids


def test_org_event_retrieve_start_date_only_filter_ok_200():
    org = OrganizationFactory.create()
    keep = _test_org_event_retrieve_make_event(name="Ends On Start", org=org)
    _test_org_event_retrieve_add_time(
        keep,
        timezone.make_aware(datetime(2026, 2, 1, 8, 0)),
        timezone.make_aware(datetime(2026, 2, 1, 9, 0)),
    )

    drop = _test_org_event_retrieve_make_event(name="Ends Before Start", org=org)
    _test_org_event_retrieve_add_time(
        drop,
        timezone.make_aware(datetime(2026, 1, 20, 8, 0)),
        timezone.make_aware(datetime(2026, 1, 25, 9, 0)),
    )

    response = _test_org_event_retrieve_list(
        org_id=org.id, params={"start_date": "2026-02-01"}
    )

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids


def test_org_event_retrieve_end_date_only_filter_ok_200():
    org = OrganizationFactory.create()
    keep = _test_org_event_retrieve_make_event(name="Starts On End", org=org)
    _test_org_event_retrieve_add_time(
        keep,
        timezone.make_aware(datetime(2026, 3, 15, 8, 0)),
        timezone.make_aware(datetime(2026, 3, 15, 9, 0)),
    )

    drop = _test_org_event_retrieve_make_event(name="Starts After End", org=org)
    _test_org_event_retrieve_add_time(
        drop,
        timezone.make_aware(datetime(2026, 3, 16, 8, 0)),
        timezone.make_aware(datetime(2026, 3, 16, 9, 0)),
    )

    response = _test_org_event_retrieve_list(
        org_id=org.id, params={"end_date": "2026-03-15"}
    )

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids
