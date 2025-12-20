# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_delete(authenticated_client) -> None:
    """
    User who is not the owner of the event tries to delete.
    """
    client, user = authenticated_client

    event = EventFactory.create()

    response = client.delete(
        path=f"/v1/events/events/{event.id}",
    )

    assert response.status_code == 401

    response_body = response.json()
    assert response_body["detail"] == "User not authorized."
