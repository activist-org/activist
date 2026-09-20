# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from events.factories import EventFactory
from events.models import EventSupport

pytestmark = pytest.mark.django_db


def test_event_support_delete_no_content_204(authenticated_client):
	client, user = authenticated_client
	event = EventFactory()
	support = EventSupport.objects.create(event=event, supporter_user=user)

	response = client.delete(path=f"/v1/events/event_supports/{event.id}")

	assert response.status_code == status.HTTP_204_NO_CONTENT
	assert not EventSupport.objects.filter(id=support.id).exists()


def test_event_support_delete_not_found_404(authenticated_client):
	client, user = authenticated_client

	response = client.delete(path=f"/v1/events/event_supports/{uuid4()}")
	response_body = response.json()

	assert response.status_code == status.HTTP_404_NOT_FOUND
	assert response_body["detail"] == "Support for this event not found."
