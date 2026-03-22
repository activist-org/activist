# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.settings import api_settings
from rest_framework.test import APIClient
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

from authentication.factories import UserFactory
from communities.organizations.views import OrganizationAPIView

pytestmark = pytest.mark.django_db

_THROTTLE_CLASSES = [
    "rest_framework.throttling.AnonRateThrottle",
    "rest_framework.throttling.UserRateThrottle",
]


def _set_test_throttle_settings(
    *, anon_rate: str, user_rate: str
) -> tuple[list[str], dict]:
    """
    Apply test throttle settings and return originals for restoration.
    """
    original_classes = list(settings.REST_FRAMEWORK.get("DEFAULT_THROTTLE_CLASSES", []))
    original_rates = dict(settings.REST_FRAMEWORK.get("DEFAULT_THROTTLE_RATES", {}))
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = list(_THROTTLE_CLASSES)
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
        **original_rates,
        "anon": anon_rate,
        "user": user_rate,
    }
    # DRF caches settings; force reload after runtime changes.
    api_settings.reload()
    return original_classes, original_rates


def _restore_throttle_settings(
    original_classes: list[str], original_rates: dict
) -> None:
    """
    Restore throttle settings after a test and clear DRF cache.
    """
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = original_classes
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = original_rates
    api_settings.reload()


def _set_test_throttle_rates_on_classes(
    *, anon_rate: str, user_rate: str
) -> tuple[dict, dict]:
    """
    Set class-level DRF throttle rates and return originals.
    """
    original_anon_rates = dict(AnonRateThrottle.THROTTLE_RATES)
    original_user_rates = dict(UserRateThrottle.THROTTLE_RATES)
    test_rates = {"anon": anon_rate, "user": user_rate}
    AnonRateThrottle.THROTTLE_RATES = dict(test_rates)
    UserRateThrottle.THROTTLE_RATES = dict(test_rates)

    return original_anon_rates, original_user_rates


def _restore_test_throttle_rates_on_classes(
    original_anon_rates: dict, original_user_rates: dict
) -> None:
    """
    Restore class-level DRF throttle rates after each test.
    """
    AnonRateThrottle.THROTTLE_RATES = original_anon_rates
    UserRateThrottle.THROTTLE_RATES = original_user_rates


def _set_test_view_throttle_classes() -> list[type]:
    """
    Force throttle classes on OrganizationAPIView for deterministic tests.

    OrganizationAPIView is imported before tests mutate settings, so its
    class-level ``throttle_classes`` may still reflect startup defaults.
    """
    original = list(getattr(OrganizationAPIView, "throttle_classes", []))
    OrganizationAPIView.throttle_classes = [AnonRateThrottle, UserRateThrottle]
    return original


def _restore_test_view_throttle_classes(original: list[type]) -> None:
    """
    Restore OrganizationAPIView throttle classes after each test.
    """
    OrganizationAPIView.throttle_classes = original


@pytest.mark.enable_throttling
def test_anon_throttle():
    """
    Test the anonymous user throttle mechanism.
    """
    cache.clear()
    client = APIClient()

    # Ensure throttle classes are active (CI may run with DEBUG=True and empty classes).
    orig_classes, orig_rates = _set_test_throttle_settings(
        anon_rate="3/min",
        user_rate="5/min",
    )
    orig_anon_rates, orig_user_rates = _set_test_throttle_rates_on_classes(
        anon_rate="3/min",
        user_rate="5/min",
    )
    orig_view_classes = _set_test_view_throttle_classes()
    try:
        endpoint = "/v1/communities/organizations"

        for i in range(3):
            response = client.get(endpoint)
            assert response.status_code == status.HTTP_200_OK

        response = client.get(endpoint)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    finally:
        _restore_test_throttle_rates_on_classes(orig_anon_rates, orig_user_rates)
        _restore_test_view_throttle_classes(orig_view_classes)
        _restore_throttle_settings(orig_classes, orig_rates)
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

    orig_classes, orig_rates = _set_test_throttle_settings(
        anon_rate="3/min",
        user_rate="5/min",
    )
    orig_anon_rates, orig_user_rates = _set_test_throttle_rates_on_classes(
        anon_rate="3/min",
        user_rate="5/min",
    )
    orig_view_classes = _set_test_view_throttle_classes()
    try:
        endpoint = "/v1/communities/organizations"

        client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
        for i in range(5):
            response = client.get(endpoint)
            assert response.status_code == status.HTTP_200_OK

        response = client.get(endpoint)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    finally:
        _restore_test_throttle_rates_on_classes(orig_anon_rates, orig_user_rates)
        _restore_test_view_throttle_classes(orig_view_classes)
        _restore_throttle_settings(orig_classes, orig_rates)
        cache.clear()
