# Fixture to provide an authenticated APIClient for DRF tests

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory


@pytest.fixture
def authenticated_client(db):
    """
    Returns an APIClient instance already authenticated as a regular user.
    """
    user = UserFactory(is_confirmed=True)
    client = APIClient()
    client.force_authenticate(user=user)
    return client
