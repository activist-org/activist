import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    client = APIClient()
    return client
