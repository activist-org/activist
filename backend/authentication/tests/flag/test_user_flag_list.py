# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_list():
    """
    Test to list all user flags.
    """
    logger.info("Starting user flag list test")
    client = APIClient()

    test_username = "username"
    test_password = "password"
    logger.debug(f"Creating test user with username: {test_username}")
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()
    logger.debug("Test user created and saved successfully")

    logger.debug("Attempting user login")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    logger.debug(f"Login successful with status code: {login.status_code}")
    login_body = login.json()

    token = login_body["token"]
    logger.debug("Setting authorization token for subsequent requests")
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    
    logger.debug("Making request to user flag endpoint")
    response = client.get(path="/v1/auth/user_flag")

    assert response.status_code == 200
    logger.info("User flag list test completed successfully")
