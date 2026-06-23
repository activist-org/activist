# SPDX-License-Identifier: AGPL-3.0-or-later
from datetime import datetime, timedelta

import pytest
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIRequestFactory

# Adjust these imports to your actual app paths if needed.
from events.models import Event, EventTime
from events.views import OrganizationEventViewSet

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
        # If your URL conf always provides org_id, you can remove this path.
        return view(request)
    return view(request, org_id=org_id)


def test_list_returns_400_when_org_id_missing():
    """
    Mirrors:
      if org_id is None -> 400 with detail message
    """
    response = _list(org_id=None)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data == {"detail": "Organization ID is required."}


def test_list_returns_empty_payload_when_org_has_no_events(organization):
    """
    Mirrors:
      if not queryset.exists() -> custom empty paginated-like payload
    """
    response = _list(org_id=organization.id)

    assert response.status_code == status.HTTP_200_OK
    assert response.data == {
        "count": 0,
        "next": None,
        "previous": None,
        "results": [],
    }


def test_list_filters_by_name_icontains(organization):
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


def test_list_filters_overlap_when_start_and_end_provided(organization):
    """
    overlap logic:
      times.start_date <= end AND times.end_date >= start
    """
    # Requested window: 2026-01-10 .. 2026-01-20
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


def test_list_filters_by_start_only_end_time_on_or_after_start(organization):
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


def test_list_filters_by_end_only_start_time_on_or_before_end(organization):
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


def test_list_without_date_filters_returns_all_events_for_org(
    organization, organization_factory
):
    """
    Ensures the 'else' branch (no date filters) does not leak other orgs' events.
    """
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


def test_list_orders_by_times_start_time_and_distinct(organization):
    """
    Verifies ordering and distinct when an event has multiple EventTime rows.
    """
    early = _make_event(name="Early Event", org=organization)
    _add_time(
        early,
        timezone.make_aware(datetime(2026, 4, 1, 9, 0)),
        timezone.make_aware(datetime(2026, 4, 1, 10, 0)),
    )
    # extra time row to exercise distinct()
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

    # distinct: appears only once despite multiple times
    assert ids_in_order.count(str(early.id)) == 1
    # order by earliest related start_time
    assert ids_in_order.index(str(early.id)) < ids_in_order.index(str(late.id))
