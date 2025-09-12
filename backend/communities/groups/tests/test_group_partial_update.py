# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test group_partial_update.py API.
"""

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_partial_update(client: Client) -> None:
    """
    Test group_partial_update.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test does not return any value. It asserts the correctness of HTTP status codes
        and error messages for the scenarios described.
    """
    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    group = GroupFactory()

    user.verified = True
    user.is_confirmed = True
    user.save()

    """
    1. Unauthorized user patches updates.
    """
    user.verified = True
    user.is_confirmed = True
    user.save()

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={
            "username": test_username,
            "password": test_password,
        },
    )

    assert login_response.status_code == 200

    login_response_body = login_response.json()
    token = login_response_body.get("access")

    group.created_by = user

    response = client.get(path=f"/v1/communities/groups/{group.id}")

    assert response.status_code == 200

    # Patch is not implemented and should return 405.
    request_body = client.patch(
        path=f"/v1/communities/groups/{group.id}",
        data={
            "groupName": "new_test_group",
            "name": "new_test_name",
            "category": "new_test_category",
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert request_body.status_code == 405
