# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupEvents entity.
"""

import pytest

from communities.groups.factories import GroupFactory
from communities.groups.models import Group
from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_group_event_multiple_events() -> None:
    """
    Test multiple events for a single group.
    """
    group = GroupFactory.create()
    events = EventFactory.create_batch(3)

    group.events.set(events)

    group = Group.objects.get(id=group.id)
    group_events = group.events.all()

    assert len(events) == len(group_events)

    for event in events:
        assert event in group_events
