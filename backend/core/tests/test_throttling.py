# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db

_THROTTLE_CLASSES = [
    "rest_framework.throttling.AnonRateThrottle",
    "rest_framework.throttling.UserRateThrottle",
]


@pytest.mark.enable_throttling
def test_anon_throttle():
    """
    Test the anonymous user throttle mechanism.
    """
    cache.clear()
    client = APIClient()

    # Ensure throttle classes are active (CI may run with DEBUG=True and empty classes).
    orig_classes = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"]
    orig_rates = settings.REST_FRAMEWORK.get("DEFAULT_THROTTLE_RATES", {})
    try:
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = _THROTTLE_CLASSES
        settings.REST_FRAMEWORK.setdefault("DEFAULT_THROTTLE_RATES", {})["anon"] = (
            "3/min"
        )
        endpoint = "/v1/communities/organizations"

        for i in range(3):
            response = client.get(endpoint)
            assert response.status_code == status.HTTP_200_OK

        response = client.get(endpoint)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    finally:
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = orig_classes
        if "anon" in orig_rates:
            settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["anon"] = orig_rates[
                "anon"
            ]
        cache.clear()


@pytest.mark.enable_throttling
def test_auth_throttle():
    """
    Test the user authentication throttle mechanism.
    """
    cache.clear()
    client = APIClient()

    test_username = "test_username"
    test_password = "test_password123!"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    token = login_response.json()["access"]

    orig_classes = settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"]
    orig_rates = settings.REST_FRAMEWORK.get("DEFAULT_THROTTLE_RATES", {})
    try:
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = _THROTTLE_CLASSES
        settings.REST_FRAMEWORK.setdefault("DEFAULT_THROTTLE_RATES", {})["user"] = (
            "5/min"
        )
        endpoint = "/v1/communities/organizations"

        client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        for i in range(5):
            response = client.get(endpoint)
            assert response.status_code == status.HTTP_200_OK

        response = client.get(endpoint)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
    finally:
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = orig_classes
        if "user" in orig_rates:
            settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["user"] = orig_rates[
                "user"
            ]
        cache.clear()
