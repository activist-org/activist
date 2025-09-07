# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory, UserFlagFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_retrieve():
    """
    Test to retrieve a flag of a user.
    """
    logger.info("Starting test_user_flag_retrieve")
    client = APIClient()

    flagged_user = UserFlagFactory()
    logger.debug(f"Created flagged user with ID: {flagged_user.id}")

    test_username = "username"
    test_password = "password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    logger.debug("Attempting user login")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    logger.debug("User login successful")

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    logger.debug("Set authorization token for API client")

    logger.debug(f"Making API request to retrieve user flag: {flagged_user.id}")
    response = client.get(path=f"/v1/auth/user_flags/{flagged_user.id}")

    assert response.status_code == 200
    logger.info("test_user_flag_retrieve completed successfully")


def test_user_flag_retrieve_does_not_exist():
    logger.info("Starting test_user_flag_retrieve_does_not_exist")
    client = APIClient()

    flagged_user = uuid4()
    logger.debug(f"Using non-existent user flag ID: {flagged_user}")

    test_username = "username"
    test_password = "password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    logger.debug("Attempting user login")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    logger.debug("User login successful")

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    logger.debug("Set authorization token for API client")

    logger.debug(
        f"Making API request to retrieve non-existent user flag: {flagged_user}"
    )
    response = client.get(path=f"/v1/auth/user_flags/{flagged_user}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
    logger.info(
        "test_user_flag_retrieve_does_not_exist completed successfully - 404 error as expected"
    )
