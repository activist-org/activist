import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory


@pytest.fixture
def authenticated_client(db):
    """
    Returns an APIClient instance authenticated as a regular user.
    """
    user = UserFactory(is_confirmed=True)
    user.set_password("Activist@123!?")
    user.save()
    client = APIClient()
    login = client.post(
        "/v1/auth/sign_in",
        data={"username": user.username, "password": "Activist@123!?"},
    )
    assert login.status_code == 200
    token = login.json()["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return client

