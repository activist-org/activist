import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client() -> APIClient:
    client = APIClient()
    return client
