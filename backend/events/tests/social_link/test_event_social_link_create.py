# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_social_link_create():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    event = EventFactory(created_by=user)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/events/event_social_links",
        data={
            "link": "https://www.activist.org",
            "label": "social link label",
            "order": 1,
            "event": event.id,
        },
    )

    assert response.status_code == 201
    assert response.json()["message"] == "Social link created successfully."


def test_social_link_create_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    event = EventFactory()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/events/event_social_links",
        data={
            "link": "https://www.activist.org",
            "label": "social link label",
            "order": 1,
            "event": event.id,
        },
    )

    assert response.status_code == 403
    assert (
        response.json()["detail"]
        == "You are not authorized to create social links for this event."
    )
