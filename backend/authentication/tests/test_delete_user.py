# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest
from rest_framework.test import APIClient

from authentication.factories import (
    UserFactory,
)

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Delete User


def test_delete_user_204() -> None:
    """
    Test the deletion of existing user records from the database.

    Parameters
    ----------
    client : APIClient
        An authenticated client.
    """
    logger.info("Starting user deletion test")
    client = APIClient()

    test_username = "test_user_123"
    test_pass = "Activist@123!?"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.save()

    # User Login
    logger.info("Authenticating user for deletion test")
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    # User deletes themselves.
    logger.info("Testing user self-deletion")
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path="/v1/auth/delete")

    assert response.status_code == 204
    logger.info(f"Successfully deleted user: {test_username}")
