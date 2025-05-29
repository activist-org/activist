# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for the events app models.
"""

import pytest

from events.factories import (
    EventAttendeeFactory,
    EventAttendeeStatusFactory,
    EventFactory,
    FormatFactory,
    RoleFactory,
)

pytestmark = pytest.mark.django_db


def test_event_str_methods() -> None:
    """
    Test string representation methods for event-related models.
    """
    event = EventFactory.create()
    event_attendee = EventAttendeeFactory.create()
    event_attendee_status = EventAttendeeStatusFactory.create()
    _format = FormatFactory.create()
    role = RoleFactory.create()

    assert str(event) == event.name
    assert str(event_attendee) == f"{event_attendee.user} - {event_attendee.event}"
    assert str(event_attendee_status) == event_attendee_status.status_name
    assert str(_format) == _format.name
    assert str(role) == role.name
