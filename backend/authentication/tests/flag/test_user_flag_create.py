# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_user_flag_create():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    flagged_user = UserFactory(
        username="flagged_user", is_confirmed=True, verified=True
    )

    error_response = client.post(
        path="/v1/auth/user_flag/",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    assert error_response.status_code == 401

    error_response_body = error_response.json()
    assert error_response_body["detail"] == "You are not allowed flag this user."

    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(
        path="/v1/auth/user_flag/",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    assert response.status_code == 201
