import pytest

from authentication.factories import UserFactory
from events.models import Event


@pytest.mark.django_db
def test_event_creation() -> None:
    user = UserFactory()
    event = Event.objects.create(
        created_by=user,
        name="Climate March",
        type="action",
        location_type="online",
    )

    assert event.name == "Climate March"
    assert str(event) == "Climate March"
