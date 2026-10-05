# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from events.factories import EventFactory
from events.models import EventSupport

pytestmark = pytest.mark.django_db

EVENT_SUPPORTS_ENDPOINT = "/v1/events/event_supports"


def test_event_support_list_ok_200(authenticated_client):
    client, user = authenticated_client
    event = EventFactory()
    support = EventSupport.objects.create(event=event, supporter_user=user)

    response = client.get(path=EVENT_SUPPORTS_ENDPOINT)
    response_body = response.json()
    results = response_body["results"]

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 1
    assert len(results) == 1
    assert results[0]["id"] == str(support.id)
    assert results[0]["event"] == str(event.id)
    assert results[0]["supporterUser"] == str(user.id)


def test_event_support_list_empty_ok_200(authenticated_client):
    client, user = authenticated_client

    response = client.get(path=EVENT_SUPPORTS_ENDPOINT)
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 0
    assert response_body["results"] == []


def test_event_support_list_unauthenticated_ok_200():
    client = APIClient()

    response = client.get(path=EVENT_SUPPORTS_ENDPOINT)
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 0
    assert response_body["results"] == []
