# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_disc_entry_create():
    """
    Test to check the creation of discussion entry.
    """
    client = APIClient()

    test_username = "test_user"
    test_pass = "test_pass"
    user = UserFactory(
        username=test_username,
        plaintext_password=test_pass,
        is_confirmed=True,
        verified=True,
    )

    discussion_thread = DiscussionFactory(created_by=user)

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    assert login_response.status_code == 200
    login_body = login_response.json()
    token = login_body["token"]

    # Passing authorization header.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/content/discussion_entries",
        data={"discussion": discussion_thread, "created_by": user},
    )

    assert response.status_code == 201
