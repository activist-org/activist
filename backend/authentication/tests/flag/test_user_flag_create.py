# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_create():
    logger.info("Starting test_user_flag_create test")
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    flagged_user = UserFactory(
        username="flagged_user", is_confirmed=True, verified=True
    )
    logger.debug(f"Created flagged user: {flagged_user.username}")

    logger.debug("Attempting user login")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    logger.debug(f"Login successful, status: {login.status_code}")

    login_body = login.json()
    token = login_body["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    logger.debug("Creating user flag")
    response = client.post(
        path="/v1/auth/user_flag",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    assert response.status_code == 201
    logger.info(f"User flag created successfully, status: {response.status_code}")


def test_user_flag_create_error():
    logger.info("Starting test_user_flag_create_error test")
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    flagged_user = UserFactory(
        username="flagged_user", is_confirmed=True, verified=True
    )
    logger.debug(f"Created flagged user: {flagged_user.username}")

    logger.debug("Attempting user flag creation without authentication")
    response = client.post(
        path="/v1/auth/user_flag",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    response_body = response.json()

    assert response.status_code == 401
    assert response_body["detail"] == "Authentication credentials were not provided."
    logger.info(
        f"Authentication error correctly returned, status: {response.status_code}"
    )
