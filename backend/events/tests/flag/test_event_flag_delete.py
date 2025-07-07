# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFlagFactory

pytestmark = pytest.mark.django_db


def test_event_flag_delete():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    flag = EventFlagFactory()

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.delete(path=f"/v1/events/event_flag/{flag.id}")

    assert response.status_code == 204


def test_event_flag_delete_doesnotexist():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    flag = uuid4()

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.delete(path=f"/v1/events/event_flag/{flag}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
