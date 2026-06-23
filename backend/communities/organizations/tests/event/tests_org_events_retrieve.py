
# SPDX-License-Identifier: AGPL-3.0-or-later

from datetime import datetime, timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIRequestFactory

# Adjust to your real module paths:
from event.models import Event, EventTime
from event.views import OrganizationEventViewSet


pytestmark = pytest.mark.django_db


def _make_event(*, name: str, org):
    event = Event.objects.create(name=name)
    event.orgs.add(org)
    return event


def _add_time(event, start_dt, end_dt):
    return EventTime.objects.create(
        event=event,
        start_time=start_dt,
        end_time=end_dt,
    )


def _list(org_id=None, params=None):
    factory = APIRequestFactory()
    request = factory.get("/fake-url/", data=params or {})
    view = OrganizationEventViewSet.as_view({"get": "list"})
    if org_id is None:
        return view(request)
    return view(request, org_id=org_id)


def test_organization_event_viewset_org_id_required_bad_request_400():
    response = _list(org_id=None)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {"detail": "Organization ID is required."}


def test_organization_event_viewset_empty_results_when_org_has_no_events_ok_200(organization):
    response = _list(org_id=organization.id)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "count": 0,
        "next": None,
        "previous": None,
        "results": [],
    }


def test_organization_event_viewset_name_filter_icontains_ok_200(organization):
    keep = _make_event(name="Community Cleanup", org=organization)
    _add_time(
        keep,
        timezone.now() + timedelta(days=1),
        timezone.now() + timedelta(days=1, hours=2),
    )

    drop = _make_event(name="Town Hall", org=organization)
    _add_time(
        drop,
        timezone.now() + timedelta(days=2),
        timezone.now() + timedelta(days=2, hours=2),
    )

    response = _list(org_id=organization.id, params={"name": "clean"})

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids


def test_organization_event_viewset_date_overlap_with_start_and_end_ok_200(organization):
    start = "2026-01-10"
    end = "2026-01-20"

    overlapping = _make_event(name="Overlaps Window", org=organization)
    _add_time(
        overlapping,
        timezone.make_aware(datetime(2026, 1, 5, 10, 0)),
        timezone.make_aware(datetime(2026, 1, 12, 12, 0)),
    )

    outside = _make_event(name="Outside Window", org=organization)
    _add_time(
        outside,
        timezone.make_aware(datetime(2026, 1, 21, 10, 0)),
        timezone.make_aware(datetime(2026, 1, 22, 12, 0)),
    )

    response = _list(
        org_id=organization.id,
        params={"start_date": start, "end_date": end},
    )

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(overlapping.id) in returned_ids
    assert str(outside.id) not in returned_ids


def test_organization_event_viewset_start_date_only_filters_by_end_time_ok_200(organization):
    start = "2026-02-01"

    keep = _make_event(name="Ends After Start", org=organization)
    _add_time(
        keep,
        timezone.make_aware(datetime(2026, 1, 28, 9, 0)),
        timezone.make_aware(datetime(2026, 2, 1, 9, 0)),
    )

    drop = _make_event(name="Ends Before Start", org=organization)
    _add_time(
        drop,
        timezone.make_aware(datetime(2026, 1, 20, 9, 0)),
        timezone.make_aware(datetime(2026, 1, 25, 9, 0)),
    )

    response = _list(org_id=organization.id, params={"start_date": start})

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids


def test_organization_event_viewset_end_date_only_filters_by_start_time_ok_200(organization):
    end = "2026-03-15"

    keep = _make_event(name="Starts Before End", org=organization)
    _add_time(
        keep,
        timezone.make_aware(datetime(2026, 3, 15, 8, 0)),
        timezone.make_aware(datetime(2026, 3, 15, 9, 0)),
    )

    drop = _make_event(name="Starts After End", org=organization)
    _add_time(
        drop,
        timezone.make_aware(datetime(2026, 3, 16, 8, 0)),
        timezone.make_aware(datetime(2026, 3, 16, 9, 0)),
    )

    response = _list(org_id=organization.id, params={"end_date": end})

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(keep.id) in returned_ids
    assert str(drop.id) not in returned_ids


def test_organization_event_viewset_no_date_filters_returns_all_org_events_ok_200(
    organization, organization_factory
):
    e1 = _make_event(name="Org Event 1", org=organization)
    _add_time(
        e1,
        timezone.now() + timedelta(days=1),
        timezone.now() + timedelta(days=1, hours=1),
    )

    e2 = _make_event(name="Org Event 2", org=organization)
    _add_time(
        e2,
        timezone.now() + timedelta(days=2),
        timezone.now() + timedelta(days=2, hours=1),
    )

    other_org = organization_factory()
    foreign = _make_event(name="Foreign Event", org=other_org)
    _add_time(
        foreign,
        timezone.now() + timedelta(days=3),
        timezone.now() + timedelta(days=3, hours=1),
    )

    response = _list(org_id=organization.id)

    assert response.status_code == status.HTTP_200_OK
    returned_ids = {str(item["id"]) for item in response.data}
    assert str(e1.id) in returned_ids
    assert str(e2.id) in returned_ids
    assert str(foreign.id) not in returned_ids


def test_organization_event_viewset_orders_by_start_time_and_distinct_ok_200(organization):
    early = _make_event(name="Early Event", org=organization)
    _add_time(
        early,
        timezone.make_aware(datetime(2026, 4, 1, 9, 0)),
        timezone.make_aware(datetime(2026, 4, 1, 10, 0)),
    )
    _add_time(
        early,
        timezone.make_aware(datetime(2026, 4, 2, 9, 0)),
        timezone.make_aware(datetime(2026, 4, 2, 10, 0)),
    )

    late = _make_event(name="Late Event", org=organization)
    _add_time(
        late,
        timezone.make_aware(datetime(2026, 4, 10, 9, 0)),
        timezone.make_aware(datetime(2026, 4, 10, 10, 0)),
    )

    response = _list(org_id=organization.id)

    assert response.status_code == status.HTTP_200_OK
    ids_in_order = [str(item["id"]) for item in response.data]
    assert ids_in_order.count(str(early.id)) == 1
    assert ids_in_order.index(str(early.id)) < ids_in_order.index(str(late.id))
