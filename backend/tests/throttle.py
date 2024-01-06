import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APIClient


class BaseTestThrottle:
    """
    Base class for testing throttling.
    ----------------------------------

    This is a base class for testing throttling.

    Attributes:
        url (str): The URL to test. Subclasses must specify.
        anon_throttle (int): The number of requests allowed per minute for anonymous users.
            (defaults 7)
        user_throttle (int): The number of requests allowed per minute for authenticated users.
            (defaults 10)
    """

    __test__ = False
    url = ""
    client = APIClient()
    anon_throttle = 7
    user_throttle = 10

    @pytest.mark.django_db
    @override_settings(
        REST_FRAMEWORK={
            "DEFAULT_THROTTLE_RATES": {
                "anon": f"{anon_throttle}/min",
                "user": f"{user_throttle}/min",
            }
        }
    )
    def test_anon_rate_throttle(self) -> None:
        cache.clear()

        for _ in range(self.anon_throttle):
            response = self.client.get(self.url)
            assert response.status_code == 200

        response = self.client.get(self.url)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    @pytest.mark.django_db
    @override_settings(
        REST_FRAMEWORK={
            "DEFAULT_THROTTLE_RATES": {
                "anon": f"{anon_throttle}/min",
                "user": f"{user_throttle}/min",
            }
        }
    )
    def test_auth_rate_throttle(self) -> None:
        test_user = get_user_model().objects.create_user(
            username="testuser", email="testuser@example.com", password="testpassword"
        )

        self.client.login(username="testuser", password="testpassword")

        try:
            for _ in range(self.user_throttle):
                response = self.client.get(self.url)
                assert response.status_code == 200

            response = self.client.get(self.url)
            assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        finally:
            test_user.delete()
