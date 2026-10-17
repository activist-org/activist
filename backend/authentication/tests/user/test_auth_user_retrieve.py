# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_auth_user_retrieve_ok_200(authenticated_client):
    client, user = authenticated_client

    response = client.get(path=f"/v1/auth/users/{user.id}")
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["id"] == str(user.id)
    assert response_body["username"] == user.username
    assert response_body["email"] == user.email


def test_auth_user_retrieve_unauthenticated_ok_200():
    client = APIClient()
    user = UserFactory()

    response = client.get(path=f"/v1/auth/users/{user.id}")

    assert response.status_code == status.HTTP_200_OK


def test_auth_user_retrieve_not_found_404(authenticated_client):
    client, user = authenticated_client

    response = client.get(path=f"/v1/auth/users/{uuid4()}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Failed to retrieve the user."
