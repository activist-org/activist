"""
Testing for the events app.
"""

# mypy: ignore-errors
import pytest

from .factories import (
    EventFactory,
    EventAttendeeFactory,
    EventAttendeeStatusFactory,
    FormatFactory,
    RoleFactory,
)

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
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
