# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_partial_update():
    """
    Test to partially update a discussion.
    """
    client = APIClient()

    test_username = "test_user"
    test_pass = "test_pass"
    user = UserFactory(
        username=test_username,
        plaintext_password=test_pass,
        verified=True,
        is_confirmed=True,
    )

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_pass},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["token"]

    discussion_thread = DiscussionFactory(created_by=user)

    # Authorized owner partially updates the discussion.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.patch(
        path=f"/v1/content/discussions/{discussion_thread.id}/",
        data={"title": "new_title"},
    )

    assert response.status_code == 200

    # Authorized non-owner partially updates the discussion.
    unowned_discussion_thread = DiscussionFactory()

    response = client.patch(
        path=f"/v1/content/discussions/{unowned_discussion_thread.id}/",
        data={"title": "new_title"},
    )

    assert response.status_code == 403

    body = response.json()
    assert body["error"] == "You are not allowed to update this discussion."
