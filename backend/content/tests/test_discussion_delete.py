# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_delete():
    """
    Test to delete a discussion.
    """
    client = APIClient()

    test_user = "test_username"
    test_pass = "test_password"
    user = UserFactory(username=test_user, plaintext_password=test_pass)
    user.verified = True
    user.is_confirmed = True
    user.save()

    discussion_thread = DiscussionFactory(created_by=user)
    unowned_discussion_thread = DiscussionFactory()

    # User login
    login = client.post(
        path="/v1/auth/sign_in/", data={"username": test_user, "password": test_pass}
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    # Authorized owner deletes the discussion.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/content/discussions/{discussion_thread.id}/")

    assert response.status_code == 204

    # Authorized non-owner deletes the discussion.
    response = client.delete(
        path=f"/v1/content/discussions/{unowned_discussion_thread.id}/"
    )

    assert response.status_code == 403
    body = response.json()
    assert body["error"] == "You are not allowed to delete this discussion."
