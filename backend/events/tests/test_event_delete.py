# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from authentication.factories import UserFactory
from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_delete(client: Client) -> None:
    """
    User who is not the owner of the event tries to delete.
    """
    test_username = "test_username"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    event = EventFactory.create()

    response = client.delete(
        path=f"/v1/events/events/{event.id}/",
        headers={"Authorization": f"Token {token}"},
    )

    assert response.status_code == 401

    response_body = response.json()
    assert response_body["detail"] == "User not authorized."
