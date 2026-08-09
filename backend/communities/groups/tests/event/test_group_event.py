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
    group_events = EventFactory.create_batch(3)

    group.events.set(group_events)

    group = Group.objects.get(id=group.id)
    all_group_events = group.events.all()

    assert len(group_events) == len(all_group_events)

    for event in group_events:
        assert event in group_events
