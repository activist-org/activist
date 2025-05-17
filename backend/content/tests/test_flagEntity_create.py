# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_flagEntity_create():
    client = APIClient()

    username = "test_username"
    password = "test_password"
    user = UserFactory(
        username=username, plaintext_password=password, is_confirmed=True, verified=True
    )

    login = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": username,
            "password": password,
        },
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    response = client.post(path="/v1/content/flag_entity/", data={"name": "test_name"})
    assert response.status_code == 403
    response_body = response.json()
    assert response_body["error"] == "You are not allowed to created this FlagEntity."

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(path="/v1/content/flag_entity/", data={"name": "test_name"})

    assert response.status_code == 201
