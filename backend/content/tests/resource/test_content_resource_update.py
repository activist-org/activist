# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import EntityLocationFactory, ResourceFactory

pytestmark = pytest.mark.django_db


def _get_login():
    client = APIClient()
    test_username = "test_user"
    test_pass = "test_pass"
    user = UserFactory(
        username="test_user",
        plaintext_password="test_pass",
        is_confirmed=True,
        verified=True,
    )

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    login_body = login_response.json()

    return {
        "user": user,
        "access_token": login_body["access"],
        "status_code": login_response.status_code,
    }


def test_content_resource_update():
    """
    Test to update the resources.
    """
    client = APIClient()

    login_details = _get_login()
    user = login_details["user"]

    resource = ResourceFactory(created_by=user)
    location = EntityLocationFactory()

    assert login_details["status_code"] == status.HTTP_200_OK

    payload = {
        "name": "new_resource",
        "description": "New Description",
        "url": "https://activist.org/",
        "order": 0,
        "location": location.id,
        "is_private": True,
        "terms_checked": True,
        "created_by": user.id,
    }

    client.credentials(HTTP_AUTHORIZATION=f"Token {login_details['access_token']}")
    response = client.put(path=f"/v1/content/resources/{resource.id}", data=payload)

    assert response.status_code == status.HTTP_200_OK


def test_content_resource_update_forbidden_403():
    client = APIClient()

    unowned_resource = ResourceFactory()
    location = EntityLocationFactory()
    user = UserFactory()

    payload = {
        "name": "new_resource",
        "description": "New Description",
        "url": "https://activist.org/",
        "order": 0,
        "location": location.id,
        "is_private": True,
        "terms_checked": True,
        "created_by": user.id,
    }

    error_response = client.put(
        path=f"/v1/content/resources/{unowned_resource.id}", data=payload
    )
    assert error_response.status_code == status.HTTP_403_FORBIDDEN

    error_body = error_response.json()
    assert error_body["detail"] == "You are not allowed to update this resource."
