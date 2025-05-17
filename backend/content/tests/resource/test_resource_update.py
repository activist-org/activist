# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import EntityLocationFactory, ResourceFactory

pytestmark = pytest.mark.django_db


def test_resource_update():
    """
    Test to update the resources.
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

    unowned_resource = ResourceFactory()
    resource = ResourceFactory(created_by=user)
    location = EntityLocationFactory()

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_user, "password": test_pass},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["token"]

    payload = {
        "name": "new_resource",
        "description": "New Description",
        "url": "https://activist.org/",
        "isPrivate": True,
        "termsChecked": True,
        "createdBy": user.id,
        "location": location.id,
    }

    # Authorized owner tries to update the resources.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(path=f"/v1/content/resources/{resource.id}/", data=payload)

    assert response.status_code == 200

    # Authorized non-owner tries to update the resources.
    error_response = client.put(
        path=f"/v1/content/resources/{unowned_resource.id}/", data=payload
    )
    assert error_response.status_code == 403

    error_body = error_response.json()
    assert error_body["error"] == "You are not allowed to update this resource."
