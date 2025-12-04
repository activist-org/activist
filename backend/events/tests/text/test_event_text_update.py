# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from events.factories import EventFactory, EventTextFactory

pytestmark = pytest.mark.django_db


def test_event_text_update(authenticated_client):
    client, user = authenticated_client

    event = EventFactory(created_by=user)
    texts = EventTextFactory(event=event)

    response = client.put(
        path=f"/v1/events/event_texts/{texts.id}",
        data={"description": "New test description for this event."},
    )

    assert response.status_code == 200


def test_event_text_update_403(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()
    texts = EventTextFactory(event=event)

    response = client.put(
        path=f"/v1/events/event_texts/{texts.id}",
        data={"description": "New test description for this event."},
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update to this event's text."
    )


def test_event_text_update_404(authenticated_client):
    client, user = authenticated_client

    bad_texts_id = uuid4()

    response = client.put(
        path=f"/v1/events/event_texts/{bad_texts_id}",
        data={"description": "New test description for this event."},
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Event text not found."
