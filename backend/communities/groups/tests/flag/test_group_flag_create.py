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

    error_response = client.post(
        path="/v1/communities/group_flag/",
        data={"group": group.id, "created_by": user.id},
    )

    assert error_response.status_code == 401

    error_response_body = error_response.json()
    assert (
        error_response_body["detail"] == "Authentication credentials were not provided."
    )

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/communities/group_flag/",
        data={"group": group.id, "created_by": user.id},
    )

    assert response.status_code == 201
