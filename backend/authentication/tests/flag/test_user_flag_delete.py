# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from authentication.factories import UserFlagFactory

pytestmark = pytest.mark.django_db


def test_user_flag_delete(authenticated_client):
    """
    Test to delete a flag of a user.
    """
    flagged_user = UserFlagFactory()

    response = authenticated_client.delete(
        path=f"/v1/auth/user_flag/{flagged_user.id}"
    )
    assert response.status_code == 204


def test_user_flag_delete_does_not_exist():
    client = APIClient()

    test_username = "username"
    test_pass = "password"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200

    bad_flagged_user_uuid = uuid4()
    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/auth/user_flag/{bad_flagged_user_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
