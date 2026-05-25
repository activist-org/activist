# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import uuid

import pytest
from rest_framework import status

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Verify Email Pwd Reset


def test_auth_verify_email_for_reset_pw_ok_200(authenticated_client) -> None:
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
    assert response.status_code == status.HTTP_200_OK

    user.refresh_from_db()
    assert user.check_password(new_password) is True
    assert user.check_password(user.password) is False
    logger.info(f"Successfully verified email for user: {user.username}")


def test_auth_verify_email_for_reset_pw_invalid_code_not_found_404(
    authenticated_client,
) -> None:
    """
    Test email verification with invalid verification code.
    """
    client, user = authenticated_client
    invalid_code = uuid.uuid4()
    logger.info("Testing invalid email verification code for password reset")
    response = client.post(path=f"/v1/auth/verify_email_password/{invalid_code}")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "User does not exist."


def test_auth_verify_email_for_reset_pw_reused_code_not_found_404(
    authenticated_client,
) -> None:
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
    assert response.status_code == status.HTTP_200_OK

    # Attempt to reuse the same verification code.
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}"
    )
    assert response.status_code == status.HTTP_404_NOT_FOUND
