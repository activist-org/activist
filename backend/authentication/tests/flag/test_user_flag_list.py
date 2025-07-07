# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_user_flag_list():
    """
    Test to list all user flags.
    """
    client = APIClient()

    test_username = "username"
    test_password = "password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()

    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.get(path="/v1/auth/user_flag")

    assert response.status_code == 200
