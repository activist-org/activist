# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFactory, EventResourceFactory

pytestmark = pytest.mark.django_db


def test_event_resource_list():
    """
    Test to list all event resources.
    """
    client = APIClient()

    user = UserFactory()
    event = EventFactory(created_by=user)

    # Create multiple resources.
    EventResourceFactory.create_batch(3, event=event, created_by=user)

    response = client.get(path="/v1/events/event_resources")
    assert response.status_code == 200

    response_body = response.json()
    assert len(response_body) >= 3


def test_event_resource_list_empty():
    """
    Test listing event resources when none exist.
    """
    client = APIClient()

    response = client.get(path="/v1/events/event_resources")
    assert response.status_code == 200

    # API returns paginated response.
    response_body = response.json()
    assert isinstance(response_body, dict)
    assert response_body["count"] == 0
    assert response_body["results"] == []
