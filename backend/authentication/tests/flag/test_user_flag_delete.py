# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory, UserFlagFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_delete():
    """
    Test to delete a flag of a user.
    """
    logger.info("Starting test_user_flag_delete")
    client = APIClient()

    test_username = "username"
    test_pass = "password"
    logger.debug(f"Creating test user with username: {test_username}")
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()
    logger.debug(f"Test user created with ID: {user.id}")

    logger.debug("Creating flagged user for deletion test")
    flagged_user = UserFlagFactory()
    logger.debug(f"Flagged user created with ID: {flagged_user.id}")

    # Login to get token.
    logger.debug("Attempting user login to get authentication token")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200
    logger.debug("User login successful")

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    logger.debug(f"Attempting to delete user flag with ID: {flagged_user.id}")
    response = client.delete(path=f"/v1/auth/user_flag/{flagged_user.id}")

    assert response.status_code == 204
    logger.info("User flag deletion test completed successfully")


def test_user_flag_delete_does_not_exist():
    logger.info("Starting test_user_flag_delete_does_not_exist")
    client = APIClient()

    test_username = "username"
    test_pass = "password"
    logger.debug(f"Creating test user with username: {test_username}")
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()
    logger.debug(f"Test user created with ID: {user.id}")

    # Login to get token.
    logger.debug("Attempting user login to get authentication token")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200
    logger.debug("User login successful")

    bad_flagged_user_uuid = uuid4()
    logger.debug(f"Attempting to delete non-existent user flag with UUID: {bad_flagged_user_uuid}")
    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/auth/user_flag/{bad_flagged_user_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
    logger.info("User flag deletion test for non-existent flag completed successfully")
