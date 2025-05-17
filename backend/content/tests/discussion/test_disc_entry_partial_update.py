# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import DiscussionEntryFactory, DiscussionFactory

pytestmark = pytest.mark.django_db


def test_disc_entry_update():
    """
    Test to partial update a discussion entry.
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

    discussion_thread = DiscussionFactory(created_by=user)
    entry_instance = DiscussionEntryFactory(created_by=user)

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/", data={"username": test_user, "password": test_pass}
    )

    assert login_response.status_code == 200
    login_body = login_response.json()
    token = login_body["token"]

    # Authorized owner partial updates the entry.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.patch(
        path=f"/v1/content/discussion_entries/{entry_instance.id}/",
        data={"discussion": discussion_thread.id},
    )

    assert response.status_code == 200

    # Unauthorized owner partially updates the entry.
    unowned_instance = DiscussionEntryFactory()
    response = client.patch(
        path=f"/v1/content/discussion_entries/{unowned_instance.id}/",
        data={"discussion": discussion_thread.id},
    )
    assert response.status_code == 403
    assert (
        response.json()["error"]
        == "You are not allowed to update this discussion entry."
    )
