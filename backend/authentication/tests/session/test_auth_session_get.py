# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.contrib.auth.models import AnonymousUser
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory

from authentication.factories import UserFactory
from authentication.views import SessionView

pytestmark = pytest.mark.django_db


def test_auth_session_get_ok_200(authenticated_client):
    client, user = authenticated_client
    response = client.get(path="/v1/auth/sessions")

    assert response.status_code == status.HTTP_200_OK


def test_auth_session_get_unauthorized_401():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    response = client.get(path="/v1/auth/sessions")

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_auth_session_view_get_anonymous_user_unauthorized_401():
    request = APIRequestFactory().get("/v1/auth/sessions")
    request.user = AnonymousUser()

    response = SessionView().get(request)

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["detail"] == "You are not authenticated."
