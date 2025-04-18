# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_retrieve(client: Client) -> None:
    """
    Retrieve event using event ID.
    """
    event = EventFactory()
    event_id = event.id

    response = client.get(path=f"/v1/events/events/{event_id}/")

    assert response.status_code == 200
