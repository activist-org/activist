import pytest
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APIClient


@pytest.mark.django_db
@override_settings(
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.AnonRateThrottle",
        ],
        "DEFAULT_THROTTLE_RATES": {
            "anon": "5/min",
        },
    }
)
def test_anon_throttle_on_swagger_ui():
    """
    This test hits the SwaggerUI endpoint as an anonymous user
    and confirms that the DRF throttle activates after 5 requests.
    """
    client = APIClient()
    cache.clear()  # Ensure the throttle state is reset

    url = "/v1/schema/swagger-ui/"

    # Hit 5 times successfully
    for _ in range(5):
        response = client.get(url)
        assert response.status_code == 200

    # 6th request should trigger throttle
    response = client.get(url)
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS
