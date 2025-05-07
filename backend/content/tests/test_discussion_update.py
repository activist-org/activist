import pytest
from django.test import Client

from authentication.factories import UserFactory
from content.factories import DiscussionFactory

pytestmark = pytest.mark.django_db


def test_discussion_update(client: Client):
    test_user = "test_user"
    test_pass = "test_pass"
    user = UserFactory(username=test_user, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.save()

    thread = DiscussionFactory()
    thread.created_by = user

    login = client.post(
        path="/v1/auth/sign_in/", data={"username": test_user, "password": test_pass}
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    response = client.put(
        path=f"/v1/content/discussions/{thread.id}/",
        data={
            "title": "New_test_title",
        },
        headers={"Authorization": f"Token {token}"},
    )

    assert response.status_code == 200
