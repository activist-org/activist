import pytest
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APIClient

from authentication.models import UserModel


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.UserRateThrottle",
        ],
        "DEFAULT_THROTTLE_RATES": {
            "user": "7/min",
        },
    }
)
def test_user_throttle_on_swagger_ui():
    """
    This test hits the SwaggerUI endpoint as an authenticated user
    and confirms that the DRF throttle activates after 7 requests.
    """
    cache.clear()

    # Create test user
    user = UserModel.objects.create_user(
        username="ratelimiteduser",
        email="rate@example.com",
        password="securepass123"
    )

    client = APIClient()
    assert client.login(username="ratelimiteduser", password="securepass123")

    url = "/v1/schema/swagger-ui/"

    for _ in range(7):
        response = client.get(url)
        assert response.status_code == 200

    # 8th request should trigger throttle
    response = client.get(url)
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    user.delete()
