# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the OrganizationEvents entity.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization
from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_org_event_multiple_events() -> None:
    """
    Test multiple events for a single organization.
    """
    org = OrganizationFactory.create()
    events = EventFactory.create_batch(3)

    org.events.set(events)

    org = Organization.objects.get(id=org.id)
    org_events = org.events.all()

    assert len(events) == len(org_events)

    for event in events:
        assert event in org_events
