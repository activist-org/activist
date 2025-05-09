# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import ResourceFactory

pytestmark = pytest.mark.django_db


def test_resource_delete():
    """
    Test to delete resources.
    """
    client = APIClient()

    test_user = "test_user"
    test_pass = "test_pass"
    user = UserFactory(
        username="test_user",
        plaintext_password="test_pass",
        is_confirmed=True,
        verified=True,
    )

    resource = ResourceFactory(created_by=user)
    unowned_resource = ResourceFactory()

    # User Login
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_user, "password": test_pass},
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    # Authorized owner tried to delete the resource.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/content/resources/{resource.id}/")

    assert response.status_code == 204

    # Authorized non-owner tries to delete the resource.
    error_response = client.delete(path=f"/v1/content/resources/{unowned_resource.id}/")
    assert error_response.status_code == 403
    error_body = error_response.json()
    assert error_body["error"] == "You are not allowed to delete this resource."
