# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_update(client: Client) -> None:
    """
    Test Group Social Link updates.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.verified = True
    user.is_confirmed = True
    user.is_staff = True
    user.save()

    group = GroupFactory()
    group.created_by = user

    social_links = GroupSocialLinkFactory()
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    # MARK: Update Success

    login_response = login.json()
    token = login_response["token"]

    response = client.put(
        path=f"/v1/communities/group_social_links/{group.id}/",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200

    # MARK: Update Failure

    test_uuid = uuid4()

    response = client.put(
        path=f"/v1/communities/group_social_links/{test_uuid}/",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 404
