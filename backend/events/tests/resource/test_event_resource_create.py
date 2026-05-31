# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from events.factories import EventFactory, EventResourceFactory

pytestmark = pytest.mark.django_db


def test_event_resource_create_ok_200(authenticated_client):
    client, user = authenticated_client
    event = EventFactory(created_by=user)

    resource = EventResourceFactory(created_by=user, event_id=event.id)
    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.post(
        path="/v1/events/event_resources",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "event": event.id,
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert response_body["message"] == "Resource created successfully."


def test_event_resource_create_forbidden_403(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()

    resource = EventResourceFactory(created_by=user, event_id=event.id)
    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.post(
        path="/v1/events/event_resources",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "event": event.id,
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to create Resources for this event."
    )
