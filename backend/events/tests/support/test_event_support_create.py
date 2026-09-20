# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from events.factories import EventFactory
from events.models import EventSupport

pytestmark = pytest.mark.django_db


def test_event_support_created_201(authenticated_client):
	client, user = authenticated_client
	event = EventFactory()

	response = client.post(path=f"/v1/events/event_supports/{event.id}", data={})

	assert response.status_code == status.HTTP_201_CREATED
	assert EventSupport.objects.filter(event=event, supporter_user=user).exists()


def test_event_support_create_unauthorized_401():
	client = APIClient()
	event = EventFactory()

	response = client.post(path=f"/v1/events/event_supports/{event.id}", data={})
	response_body = response.json()

	assert response.status_code == status.HTTP_401_UNAUTHORIZED
	assert response_body["detail"] == "Authentication credentials were not provided."
