# SPDX-License-Identifier: AGPL-3.0-or-later

from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFlagFactory

pytestmark = pytest.mark.django_db


def test_group_flag_retrieve():
    """
    Test to retrieve a flag of a group.
    """
    client = APIClient()

    flag = GroupFlagFactory()

    test_username = "username"
    test_password = "password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/communities/group_flags/{flag.id}")

    assert response.status_code == 200


def test_group_flag_retrieve_error():
    client = APIClient()

    flag = uuid4()

    test_username = "username"
    test_password = "password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.get(path=f"/v1/communities/group_flags/{flag}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
