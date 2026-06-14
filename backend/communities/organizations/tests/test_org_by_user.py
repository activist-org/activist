# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_by_user_ok_200():
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
    assert user_login.status_code == status.HTTP_200_OK

    response = client.get(
        path=f"/v1/communities/organizations_by_user/{user.id}",
        headers={"Authorization": f"Token {token}"},
    )

    print(response.json())

    assert response.status_code == status.HTTP_200_OK


def test_org_by_user_non_admin_ok_200() -> None:
    """
    Regression test: non-admin users previously got a FieldError (HTTP 500)
    from the invalid created_by__user__id lookup, and a bare list instead of
    the paginated envelope the frontend expects.
    """
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    own_orgs = OrganizationFactory.create_batch(2, created_by=user)
    OrganizationFactory()  # another user's org that must not be returned

    user_login = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    user_login_body = user_login.json()
    token = user_login_body["access"]
    assert user_login.status_code == status.HTTP_200_OK

    response = client.get(
        path=f"/v1/communities/organizations_by_user/{user.id}",
        headers={"Authorization": f"Token {token}"},
    )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()
    assert set(body.keys()) >= {"count", "next", "previous", "results"}
    assert body["count"] == 2
    assert {org["id"] for org in body["results"]} == {str(org.id) for org in own_orgs}


def test_org_by_user_forbidden_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    response = client.get(path=f"/v1/communities/organizations_by_user/{user.id}")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_org_by_user_unauthorized_401():
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

    assert user_login.status_code == status.HTTP_200_OK

    response = client.get(
        path=f"/v1/communities/organizations_by_user/{non_authenticated_user.id}"
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
