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


def get_login(client: Client, staff_user=False):
    """
    Login credentials for group tests.
    """
    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)

    user.is_confirmed = True
    user.verified = True
    user.is_staff = staff_user
    user.save()

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )
    login_response_body = login_response.json()

    response_code = login_response.status_code
    access_token = login_response_body.get("access")

    return (response_code, access_token, user)


def test_group_delete_unauthorized_403(client: Client) -> None:
    """
    Un-Authorized user trying to delete group (not staff).
    """
    group = GroupFactory()
    login_details = get_login(client)
    group.created_by = login_details[2]

    assert login_details[0] == 200

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}",
        headers={"Authorization": f"Token {login_details[1]}"},
    )

    assert delete_response.status_code == 403

    delete_response_json = delete_response.json()
    assert (
        delete_response_json["detail"]
        == "You are not authorized to perform this action."
    )


def test_group_delete_404(client: Client) -> None:
    """
    Group id not found.
    """
    login_details = get_login(client)
    test_uuid = uuid4()

    assert login_details[0] == 200

    delete_response = client.delete(
        path=f"/v1/communities/groups/{test_uuid}",
        headers={"Authorization": f"Token {login_details[1]}"},
    )

    assert delete_response.status_code == 404

    delete_response_json = delete_response.json()
    assert delete_response_json["detail"] == "Group not found."
    delete_response_json = delete_response.json()
    assert delete_response_json["detail"] == "Group not found."


def test_group_delete_staffuser_204(client: Client) -> None:
    """
    User is confirmed and is staff.
    """
    group = GroupFactory()
    login_details = get_login(client, staff_user=True)
    group.created_by = login_details[2]

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}",
        headers={"Authorization": f"Token {login_details[1]}"},
    )

    assert delete_response.status_code == 204
