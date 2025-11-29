# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import uuid

import pytest

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Verify Email Pwd Reset


def test_verify_email_for_reset_password_valid_code(authenticated_client) -> None:
    """
    Test email verification with valid verification code and new password.

    """
    logger.info("Testing valid email verification for password reset")
    client, user = authenticated_client
    new_password = "Activist@123!?"
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}",
        data={"new_password": new_password},
    )
    assert response.status_code == 200

    user.refresh_from_db()
    assert user.check_password(new_password) is True
    assert user.check_password(user.password) is False
    logger.info(f"Successfully verified email for user: {user.username}")


def test_verify_email_for_reset_password_invalid_code(authenticated_client) -> None:
    """
    Test email verification with invalid verification code.

    """
    client, user = authenticated_client
    invalid_code = uuid.uuid4()
    logger.info("Testing invalid email verification code for password reset")
    response = client.post(path=f"/v1/auth/verify_email_password/{invalid_code}")
    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_verify_email_for_reset_password_reused_code(authenticated_client) -> None:
    """
    Test that already used verification code cannot be reused.
    """
    logger.info("Testing reuse of already used verification code")
    client, user = authenticated_client
    new_password = "Activist@123!?"

    # Use the verification code once.
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}",
        data={"new_password": new_password},
    )
    assert response.status_code == 200

    # Attempt to reuse the same verification code.
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}"
    )
    assert response.status_code == 404
