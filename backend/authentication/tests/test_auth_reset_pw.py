# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest
from rest_framework import status

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Password Reset


def test_auth_reset_pw_email_sent_successfully_ok_200(
    authenticated_client,
) -> None:
    """
    Test that password reset email is sent successfully for a valid user.
    """
    logger.info("Testing password reset email request for valid user")
    client, user = authenticated_client

    response = client.post(
        path="/v1/auth/pwreset",
        data={"email": user.email},
    )

    assert response.status_code == status.HTTP_200_OK
    logger.info(f"Password reset email sent successfully to: {user.email}")


def test_auth_reset_pw_invalid_email_ok_200(authenticated_client) -> None:
    """
    Test password reset attempt with an invalid email.

    Note: We send 200 on invalid emails so that responses are consistent to prevent timing attacks.
    """
    logger.info("Testing password reset with invalid email")
    client, user = authenticated_client
    response = client.post(
        path="/v1/auth/pwreset", data={"email": "invalid_email@example.com"}
    )

    assert response.status_code == status.HTTP_200_OK


def test_auth_reset_pw_invalid_verification_code_not_found_404(
    authenticated_client,
) -> None:
    """
    Test password reset attempt with an invalid verification code.
    """
    logger.info("Testing password reset with invalid verification code")
    client, user = authenticated_client
    new_password = "Activist@123!?"

    response = client.post(
        path="/v1/auth/pwreset/invalid_code",
        data={"password": new_password},
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
