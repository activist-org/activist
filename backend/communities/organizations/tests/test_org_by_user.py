# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_org_by_user_200():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    user_login = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    user_login_body = user_login.json()
    token = user_login_body["access"]
    assert user_login.status_code == 200

    response = client.get(
        path=f"/v1/communities/organizations_by_user/{user.id}",
        headers={"Authorization": f"Token {token}"},
    )

    print(response.json())

    assert response.status_code == 200


def test_org_by_user_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    response = client.get(path=f"/v1/communities/organizations_by_user/{user.id}")

    assert response.status_code == 401


def test_org_by_user_401():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    non_authenticated_username = "null_user"
    non_authenticated_password = "null_pass"
    non_authenticated_user = UserFactory(
        username=non_authenticated_username,
        plaintext_password=non_authenticated_password,
    )
    non_authenticated_user.verified = True
    non_authenticated_user.is_confirmed = True
    non_authenticated_user.save()

    user_login = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    assert user_login.status_code == 200

    response = client.get(
        path=f"/v1/communities/organizations_by_user/{non_authenticated_user.id}"
    )

    assert response.status_code == 401
