import logging

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Sign In
def test_sign_in(client: APIClient) -> None:
    """
    Test sign in view.

    This test covers several user sign-in scenarios:
    1. User that signed up with email but has not confirmed their email.
    2. User that confirmed email address and logs in successfully.
    3. User exists but password is incorrect.
    4. User does not exist and tries to sign in.

    Parameters
    ----------
    client : APIClient
        An authenticated client.
    """
    logger.info("Starting sign-in test with various scenarios")
    plaintext_password = "Activist@123!?"
    user = UserFactory(plaintext_password=plaintext_password)

    # 1. User that signed up with email, that has not confirmed their email.
    response = client.post(
        path="/v1/auth/sign_in",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 400

    # 2. User that signed up with email, confirmed email address. Is logged in successfully.
    logger.info("Testing successful sign-in with confirmed user")
    user.is_confirmed = True
    user.save()
    response = client.post(
        path="/v1/auth/sign_in",
        data={"email": user.email, "password": plaintext_password},
    )
    assert response.status_code == 200

    # Sign in via username.
    response = client.post(
        path="/v1/auth/sign_in",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 200
    logger.info(
        f"Successfully signed in user: {user.username} via both email and username"
    )

    # 3. User exists but password is incorrect.
    response = client.post(
        path="/v1/auth/sign_in",
        data={"email": user.email, "password": "Strong_But_Incorrect?!123"},
    )
    assert response.status_code == 400

    # 4. User does not exists and tries to sign in.
    response = client.post(
        path="/v1/auth/sign_in",
        data={"email": "unknown_user@example.com", "password": "Password@123!?"},
    )
    assert response.status_code == 400
