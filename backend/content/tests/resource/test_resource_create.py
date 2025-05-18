# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import EntityLocationFactory, ResourceFactory

pytestmark = pytest.mark.django_db


def test_resource_create():
    """
    Test to create a resource.
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

    resource_instance = ResourceFactory(created_by=user)
    location = EntityLocationFactory()

    payload = {
        "name": resource_instance.name,
        "description": resource_instance.description,
        "url": resource_instance.url,
        "category": resource_instance.category,
        "created_by": user.id,
        "termsChecked": True,
        "isPrivate": False,
        "location": location.id,
    }

    # Authorized user creates resource.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(path="/v1/content/resources/", data=payload)

    assert response.status_code == 201
