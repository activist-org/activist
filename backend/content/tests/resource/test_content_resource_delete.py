# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import ResourceFactory

pytestmark = pytest.mark.django_db


def _get_login(client: APIClient):
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
        "status_code": login_response.status_code,
        "access_token": login_body["access"],
    }


def test_content_resource_delete_ok_200():
    """
    Test to delete resources.
    """
    client = APIClient()
    login_details = _get_login(client)
    resource = ResourceFactory(created_by=login_details["user"])

    assert login_details["status_code"] == status.HTTP_200_OK

    client.credentials(HTTP_AUTHORIZATION=f"Token {login_details['access_token']}")
    response = client.delete(path=f"/v1/content/resources/{resource.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_content_resource_delete_forbidden_403():
    client = APIClient()
    unowned_resource = ResourceFactory()
    error_response = client.delete(path=f"/v1/content/resources/{unowned_resource.id}")
    assert error_response.status_code == status.HTTP_403_FORBIDDEN

    error_body = error_response.json()
    assert error_body["detail"] == "You are not allowed to delete this resource."
