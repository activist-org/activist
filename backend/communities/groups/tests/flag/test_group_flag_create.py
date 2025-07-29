# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_flag_create():
    """
    Test to create a flag for a group.
    """
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    group = GroupFactory()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/communities/group_flag",
        data={"group": group.id, "created_by": user.id},
    )

    assert response.status_code == 201


def test_group_flag_create_error():
    """
    Test to create a flag for a group as an unauthorized user.
    """
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    group = GroupFactory()

    response = client.post(
        path="/v1/communities/group_flag",
        data={"group": group.id, "created_by": user.id},
    )
    response_body = response.json()

    assert response.status_code == 401
    assert response_body["detail"] == "Authentication credentials were not provided."
