# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from content.factories import ResourceFactory

pytestmark = pytest.mark.django_db


def test_resource_flag_create():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.verified = True
    user.is_confirmed = True
    user.save()

    resource = ResourceFactory()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/content/resource_flag",
        data={"resource": resource.id, "created_by": user.id},
    )

    assert response.status_code == 201


def test_resource_flag_create_error():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.verified = True
    user.is_confirmed = True
    user.save()

    resource = ResourceFactory()

    response = client.post(
        path="/v1/content/resource_flag",
        data={"resource": resource.id, "created_by": user.id},
    )
    response_body = response.json()

    assert response.status_code == 401
    assert response_body["detail"] == "Authentication credentials were not provided."
