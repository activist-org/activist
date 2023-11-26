from django import db
import pytest
from django.core.cache import cache
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework import status
from django.test import override_settings


class BaseTestThrottle:
    __test__ = False
    url = None  # Subclasses must specify
    client = APIClient()
    anon_throttle = "7/min"  # Default
    user_throttle = "10/min"  # Default

    @pytest.mark.django_db
    @override_settings(
        REST_FRAMEWORK={
            "DEFAULT_THROTTLE_RATES": {"anon": anon_throttle, "user": user_throttle}
        }
    )
    def test_anon_rate_throttle(self):
        cache.clear()

        # Make 7 requests from the same IP address within a minute
        limit = int(self.anon_throttle[0])
        for _ in range(limit):
            response = self.client.get(self.url)
            assert response.status_code == 200

        # Make another request and expect a 429 Too Many Requests response
        response = self.client.get(self.url)
        assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    @pytest.mark.django_db
    @override_settings(
        REST_FRAMEWORK={
            "DEFAULT_THROTTLE_RATES": {"anon": anon_throttle, "user": user_throttle}
        }
    )
    def test_auth_rate_throttle(self):
        # Create a user for testing
        test_user = get_user_model().objects.create_user(
            username="testuser", email="testuser@example.com", password="testpassword"
        )

        # Authenticate the user
        self.client.login(username="testuser", password="testpassword")

        # Make 10 requests from the same user
        limit = int(self.user_throttle[0])
        try:
            for _ in range(10):
                response = self.client.get(self.url)
                assert response.status_code == 200

            # Make another request and expect a 429 Too Many Requests response
            response = self.client.get(self.url)
            assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        finally:
            test_user.delete()
