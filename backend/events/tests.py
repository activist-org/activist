"""
Testing for the events app.
"""

from django.urls import reverse
from tests.throttle import BaseTestThrottle

from .factories import (
    EventFactory,
    EventAttendeeFactory,
    EventFormatFactory,
    EventAttendeeStatusFactory,
    EventResourceFactory,
    FormatFactory,
    RoleFactory,
)


class EventsThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("events:event-list")


def test_str_methods() -> None:
    event = EventFactory.build()
    event_attendee = EventAttendeeFactory.build()
    event_format = EventFormatFactory.build()
    event_attendee_status = EventAttendeeStatusFactory.build()
    event_resource = EventResourceFactory.build()
    _format = FormatFactory.build()
    role = RoleFactory.build()
    assert str(event) == event.name
    assert (
        str(event_attendee) == f"{event_attendee.user_id} - {event_attendee.event_id}"
    )
    assert str(event_format) == f"{event_format.id}"
    assert str(event_attendee_status) == event_attendee_status.status_name
    assert str(event_resource) == f"{event_resource.id}"
    assert str(_format) == _format.name
    assert str(role) == role.name
