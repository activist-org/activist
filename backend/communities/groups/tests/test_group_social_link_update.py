# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test Group Social Link Update.
"""

from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_update(client: Client) -> None:
    """
    Test Group Social Link Update.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    test_user = "test_user"
    test_plaintext_password = "test_pass"
    user = UserFactory(username=test_user, plaintext_password=test_plaintext_password)
    group = GroupFactory()
    social_links = GroupSocialLinkFactory()

    user.verified = True
    user.is_confirmed = True
    user.is_staff = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_user, "password": test_plaintext_password},
    )

    assert login.status_code == 200

    login_response = login.json()
    token = login_response["token"]

    response = client.put(
        path=f"/v1/communities/group_social_links/{group.id}/",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200

    """
    2. Group not found.
    """

    test_uuid = uuid4()

    response = client.put(
        path=f"/v1/communities/group_social_links/{test_uuid}/",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 404
