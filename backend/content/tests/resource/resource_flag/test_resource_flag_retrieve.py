# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import ResourceFlagFactory

pytestmark = pytest.mark.django_db


def test_resource_flag_retrieve():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    flag = ResourceFlagFactory()

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.get(path=f"/v1/content/resource_flag/{flag.id}")

    assert response.status_code == 200


def test_resource_flag_retrieve_does_not_exist():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    bad_flagged_resource_uuid = uuid4()
    login_body = login.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/content/resource_flag/{bad_flagged_resource_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
