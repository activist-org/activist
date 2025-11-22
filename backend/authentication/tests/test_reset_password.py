# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from unittest.mock import patch

import pytest
from django.core import mail

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Password Reset


def test_pwreset_email_sent_successfully(authenticated_client) -> None:
    """
    Test that password reset email is sent successfully for a valid user.

    """
    logger.info("Testing password reset email request for valid user")
    client, user = authenticated_client

    response = client.post(
        path="/v1/auth/pwreset",
        data={"email": user.email},
    )

    assert response.status_code == 200
    assert len(mail.outbox) == 1
    logger.info(f"Password reset email sent successfully to: {user.email}")


def test_pwreset_invalid_email(authenticated_client) -> None:
    """
    Test password reset attempt with an invalid email.
    """
    logger.info("Testing password reset with invalid email")
    client, user = authenticated_client
    response = client.post(
        path="/v1/auth/pwreset", data={"email": "invalid_email@example.com"}
    )

    assert response.status_code == 404


def test_pwreset_invalid_verification_code(authenticated_client) -> None:
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

    assert response.status_code == 404


def test_pwreset_email_sending_failure(authenticated_client) -> None:
    """
    Test password reset when email sending fails.

    This test verifies that the except block in PasswordResetView is triggered
    when send_mail raises an exception, and that the view returns a 500 error.
    """
    logger.info("Testing password reset email sending failure")
    client, user = authenticated_client

    # Mock send_mail to raise an exception
    with patch("authentication.views.send_mail") as mock_send_mail:
        mock_send_mail.side_effect = Exception("SMTP server error")

        response = client.post(
            path="/v1/auth/pwreset",
            data={"email": user.email},
        )

        assert response.status_code == 500
        assert response.data["detail"] == "Failed to send password reset email."
        mock_send_mail.assert_called_once()
