# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_social_link_created_201(authenticated_client):
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

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["message"] == "Social link created successfully."


def test_event_social_link_create_forbidden_403(authenticated_client):
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

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response.json()["detail"]
        == "You are not authorized to create social links for this event."
    )
