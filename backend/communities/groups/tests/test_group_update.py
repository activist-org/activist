# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test group update functionality.
"""

import pytest
from django.test import Client
from rest_framework import status

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def _get_login(client: Client, staff_user=False):
    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)

    user.verified = True
    user.is_confirmed = True
    user.is_staff = staff_user
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    body = login_response.json()

    return {
        "user": user,
        "login_status_code": login_response.status_code,
        "access_token": body["access"],
    }


def test_group_update_forbidden_403(authenticated_client) -> None:
    """
    Test that an authenticated non-owner cannot update a group.
    """
    client, user = authenticated_client

    group = GroupFactory()
    original_values = (group.name, group.category)

    request_body = client.put(
        path=f"/v1/communities/groups/{group.id}",
        data={
            "name": "new_test_name",
            "category": "new_test_category",
        },
        content_type="application/json",
    )

    assert request_body.status_code == status.HTTP_403_FORBIDDEN

    request_body_json = request_body.json()
    assert (
        request_body_json["detail"] == "You are not authorized to perform this action."
    )
    group.refresh_from_db()
    assert (group.name, group.category) == original_values


def test_group_update_ok_200(client: Client):
    """
    Test for Authorized user updating the group information.
    """

    login_details = _get_login(client, staff_user=True)
    assert login_details["login_status_code"] == status.HTTP_200_OK

    group = GroupFactory()
    group.created_by = login_details["user"]

    response = client.get(path=f"/v1/communities/groups/{group.id}")

    assert response.status_code == status.HTTP_200_OK

    request_body = client.put(
        path=f"/v1/communities/groups/{group.id}",
        data={
            "groupName": "new_test_group",
            "name": "new_test_name",
            "category": "new_test_category",
        },
        headers={"Authorization": f"Token {login_details['access_token']}"},
        content_type="application/json",
    )

    assert request_body.status_code == status.HTTP_200_OK
