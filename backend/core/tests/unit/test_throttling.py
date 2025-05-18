# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


@pytest.mark.enable_throttling
def test_anon_throttle():
    """
    Test the anonymous user throttle mechanism.
    """
    # Override the autouse fixture by resetting throttle rates for this test
    # and clear the cache to ensure a clean state
    cache.clear()
    client = APIClient()

    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["anon"] = "3/min"
    endpoint = "/v1/communities/organizations/"

    for i in range(3):
        print(f"Request {i + 1}")
        response = client.get(endpoint)
        assert response.status_code == status.HTTP_200_OK

    response = client.get(endpoint)
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    # Reset the throttle rates
    # This is necessary to ensure that the test does not affect other tests
    cache.clear()
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["anon"] = None


@pytest.mark.enable_throttling
def test_auth_throttle():
    """
    Test the user authentication throttle mechanism.
    """
    # Override the autouse fixture by resetting throttle rates for this test
    # and clear the cache to ensure a clean state
    cache.clear()
    client = APIClient()

    test_username = "test_username"
    test_plaintext_password = "test_password123!"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_plaintext_password},
    )
    token = login_response.json()["token"]

    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["user"] = "5/min"
    endpoint = "/v1/communities/organizations/"

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    for i in range(5):
        print(f"Request {i + 1}")
        response = client.get(endpoint)
        assert response.status_code == status.HTTP_200_OK

    response = client.get(endpoint)
    print(f"Request {6}")
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    # Reset the throttle rates
    # This is necessary to ensure that the test does not affect other tests
    cache.clear()
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["user"] = None
