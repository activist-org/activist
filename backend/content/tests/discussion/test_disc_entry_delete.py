# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionEntryFactory

pytestmark = pytest.mark.django_db


def test_disc_entry_delete():
    """
    Test for checking the deletion of discussion entry.
    """
    client = APIClient()

    test_user = "test_user"
    test_pass = "test_pass"
    user = UserFactory(
        username=test_user,
        plaintext_password=test_pass,
        is_confirmed=True,
        verified=True,
    )

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/", data={"username": test_user, "password": test_pass}
    )

    assert login_response.status_code == 200
    login_body = login_response.json()
    token = login_body["token"]

    discussion_entry = DiscussionEntryFactory(created_by=user)

    # Check of authorized owner deleting the discussion entry.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(
        path=f"/v1/content/discussion_entries/{discussion_entry.id}/"
    )

    assert response.status_code == 204

    # Check of authorized non-owner deleting the discussion entry.
    unowned_entry = DiscussionEntryFactory()

    error_response = client.delete(
        path=f"/v1/content/discussion_entries/{unowned_entry.id}/"
    )

    assert error_response.status_code == 403

    error_response_body = error_response.json()
    assert (
        error_response_body["error"]
        == "You are not allowed to delete this discussion entry."
    )
