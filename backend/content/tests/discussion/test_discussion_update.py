# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_update():
    client = APIClient()
    test_username = "test_user"
    test_pass = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory(created_by=user)

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_pass},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(
        path=f"/v1/content/discussions/{thread.id}/",
        data={"title": thread.title},
    )

    assert response.status_code == 200
