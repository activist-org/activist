# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_create(client: Client):
    test_user = "test_user"
    test_pass = "test_pass"
    user = UserFactory(username=test_user, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.save()

    discussion_thread = DiscussionFactory()

    login = client.post(
        path="/v1/auth/sign_in/", data={"username": test_user, "password": test_pass}
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    response = client.post(
        path="/v1/content/discussions/",
        data={
            "title": discussion_thread.title,
            "category": discussion_thread.category,
            "created_by": user.id,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200
