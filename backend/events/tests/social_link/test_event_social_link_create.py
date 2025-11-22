# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_social_link_create(authenticated_client):
    client, user = authenticated_client
    event = EventFactory(created_by=user)

    response = client.post(
        path="/v1/events/event_social_links",
        data={
            "link": "https://www.activist.org",
            "label": "social link label",
            "order": 1,
            "event": event.id,
        },
    )

    assert response.status_code == 201
    assert response.json()["message"] == "Social link created successfully."


def test_social_link_create_403(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()

    response = client.post(
        path="/v1/events/event_social_links",
        data={
            "link": "https://www.activist.org",
            "label": "social link label",
            "order": 1,
            "event": event.id,
        },
    )

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You are not authorized to create social links for this event."
    )
