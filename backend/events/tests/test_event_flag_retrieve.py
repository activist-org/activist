import pytest
from rest_framework.test import APIClient

from events.factories import EventFlagFactory

pytestmark = pytest.mark.django_db


def test_event_flag_retrieve():
    client = APIClient()

    flag = EventFlagFactory()

    response = client.get(path=f"/v1/events/event_flag/{flag.id}/")

    assert response.status_code == 200
