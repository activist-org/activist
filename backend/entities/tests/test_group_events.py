"""
Test cases for the GroupEvents entity.
"""

import pytest

from entities.factories import GroupEventFactory, GroupFactory

pytestmark = pytest.mark.django_db


def test_group_event_str() -> None:
    """Test string representation of GroupEvent model."""
    group_event = GroupEventFactory.build()
    assert str(group_event) == f"{group_event.id}"


def test_multiple_events_per_group() -> None:
    """Test multiple events for a single group."""
    group = GroupFactory()
    events = [GroupEventFactory(group=group) for _ in range(3)]

    assert len(events) == 3
    for event in events:
        assert event.group == group
