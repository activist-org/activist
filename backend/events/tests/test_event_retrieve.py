# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for retrieving events.
"""

from uuid import uuid4

import pytest
from django.test import Client
from rest_framework import status
from rest_framework.test import APIClient

from events.factories import EventFactory
from events.models import EventSupport
from events.serializers import EventSerializer

pytestmark = pytest.mark.django_db


def test_event_retrieve_ok_200(client: Client) -> None:
    """
    Retrieve event using event ID.
    """
    event = EventFactory()

    response = client.get(path=f"/v1/events/events/{event.id}")

    assert response.status_code == status.HTTP_200_OK
    response_body = response.json()
    assert response_body["id"] == str(event.id)
    assert response_body["name"] == event.name
    assert response_body["tagline"] == event.tagline


def test_event_retrieve_unauthenticated_ok_200() -> None:
    client = APIClient()
    event = EventFactory()

    response = client.get(path=f"/v1/events/events/{event.id}")

    assert response.status_code == status.HTTP_200_OK


def test_event_retrieve_supported_by_authenticated_user(authenticated_client) -> None:
    client, user = authenticated_client
    event = EventFactory()
    EventSupport.objects.create(event=event, supporter_user=user)

    response = client.get(path=f"/v1/events/events/{event.id}")
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["id"] == str(event.id)


def test_event_retrieve_not_found_404(client: Client) -> None:
    response = client.get(path=f"/v1/events/events/{uuid4()}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Event Not Found."


def test_event_retrieve_serializer_support_methods():
    event = EventFactory()
    serializer = EventSerializer(event)

    assert serializer.get_supporter_count(event) == 0
    assert serializer.get_is_supported_by_user(event) is False
