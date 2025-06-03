# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test Group Delete API.
"""

from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_delete(client: Client) -> None:
    """
    Test Group Delete API.

    Parameters
    ----------
    client : Client
        A Django test client used for making requests.

    Returns
    -------
    None
        This test asserts the correctness of HTTP status codes (401 for unauthorized, 200 for success).
    """
    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    group = GroupFactory()

    """
    # 1. Un-Authorized user trying to delete group (not staff).
    """
    user.is_confirmed = True
    user.verified = True
    user.save()

    group.created_by = user

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}/",
        headers={"Authorization": f"Token {token}"},
    )

    assert delete_response.status_code == 403

    delete_response_json = delete_response.json()
    assert (
        delete_response_json["detail"]
        == "You are not authorized to perform this action."
    )

    """
    2. Group id not found.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    test_uuid = uuid4()

    group.created_by = user

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{test_uuid}/",
        headers={"Authorization": f"Token {token}"},
    )

    assert delete_response.status_code == 404

    delete_response_json = delete_response.json()
    assert delete_response_json["error"] == "Group not found"

    """
    3. User is confirmed and is staff.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    group.created_by = user

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}/",
        headers={"Authorization": f"Token {token}"},
    )

    assert delete_response.status_code == 200
