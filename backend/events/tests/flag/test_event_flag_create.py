# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_flag_create(authenticated_client):
    client, user = authenticated_client

    event = EventFactory()
    response = client.post(
        path="/v1/events/event_flags", data={"event": event.id, "created_by": user.id}
    )

    assert response.status_code == 201


def test_event_flag_create_error():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    event = EventFactory()

    response = client.post(
        path="/v1/events/event_flags", data={"event": event.id, "created_by": user.id}
    )
    response_body = response.json()

    assert response.status_code == 401
    assert response_body["detail"] == "Authentication credentials were not provided."
