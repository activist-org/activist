import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory


@pytest.fixture
def authenticated_client(db):
    """
    Returns an APIClient instance authenticated as a regular user.
    """
    user = UserFactory(is_confirmed=True)  # adapte selon les besoins
    password = getattr(user, "plaintext_password", "Activist@123!?")  
    client = APIClient()
    # Effectue la connexion pour obtenir un token
    login = client.post(
        "/v1/auth/sign_in",
        data={"username": user.username, "password": password},
    )
    assert login.status_code == 200
    token = login.json()["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return client
