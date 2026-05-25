# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from events.factories import EventFactory, EventResourceFactory

pytestmark = pytest.mark.django_db


def test_event_resource_update_ok_200(authenticated_client):
    client, user = authenticated_client

    event = EventFactory(created_by=user)

    resource = EventResourceFactory(created_by=user, event_id=event.id)
    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/events/event_resources/{resource.id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "event": event.id,
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["message"] == "Resource updated successfully."


def test_event_resource_update_forbidden_403(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()

    resource = EventResourceFactory(created_by=user, event_id=event.id)
    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/events/event_resources/{resource.id}",
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
    assert response_body["detail"] == "You are not authorized to update this Resource."


def test_event_resource_update_not_found_404(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()
    bad_resource_id = uuid4()

    resource = EventResourceFactory(created_by=user, event_id=event.id)
    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/events/event_resources/{bad_resource_id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "event": event.id,
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Resource not found."
