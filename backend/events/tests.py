from django.test import TestCase
import pytest

from .factory import EventFactory, EventAttendeeFactory, EventFormatFactory, EventAttendeeStatusFactory, EventResourceFactory, FormatFactory, RoleFactory


@pytest.mark.django_db
def test_str_methods() -> None:
    event = EventFactory()
    assert str(event) == event.name

    event_attendee = EventAttendeeFactory()
    assert str(
        event_attendee) == f"{event_attendee.user_id} - {event_attendee.event_id}"

    event_format = EventFormatFactory()
    assert str(
        event_format) == f"{event_format.event_id} - {event_format.format_id}"

    event_attendee_status = EventAttendeeStatusFactory()
    assert str(event_attendee_status) == event_attendee_status.status_name

    event_resource = EventResourceFactory()
    assert str(
        event_resource) == f"{event_resource.event_id} - {event_resource.resource_id}"

    _format = FormatFactory()
    assert str(_format) == _format.name

    role = RoleFactory()
    assert str(role) == role.name
