# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test group update functionality.
"""

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_update(client: Client) -> None:
    """
    1. Test for when the user is not authorized (not staff).

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
    test_plaintext_password = "test_pass"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    group = GroupFactory()

    user.verified = True
    user.is_confirmed = True
    user.save()

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("token")

    group.created_by = user

    response = client.get(path=f"/v1/communities/groups/{group.id}/")
    assert response.status_code == 200

    request_body = client.put(
        path=f"/v1/communities/groups/{group.id}/",
        data={
            "groupName": "new_test_group",
            "name": "new_test_name",
            "category": "new_test_category",
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert request_body.status_code == 403

    request_body_json = request_body.json()
    assert request_body_json["detail"] == "You are not authorized to update this group"

    """
    2. Test for Authorized user updating the group information.
    """
    test_username = "test_user"
    test_plaintext_password = "test_pass"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    group = GroupFactory()

    user.verified = True
    user.is_confirmed = True
    user.is_staff = True
    user.save()

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("token")

    group.created_by = user

    response = client.get(path=f"/v1/communities/groups/{group.id}/")

    assert response.status_code == 200

    request_body = client.put(
        path=f"/v1/communities/groups/{group.id}/",
        data={
            "groupName": "new_test_group",
            "name": "new_test_name",
            "category": "new_test_category",
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert request_body.status_code == 200
