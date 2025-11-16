# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Password Reset


def test_pwreset(client: APIClient) -> None:
    """
    Test password reset view.

    This test covers various password reset scenarios:
    1. Password reset email is sent successfully for a valid user.
    2. Password reset attempt with an invalid email.
    3. Password reset is performed successfully with a valid verification code.
    4. Password reset attempt with an invalid verification code.

    Parameters
    ----------
    client : APIClient
        An authenticated client.
    """
    logger.info("Starting password reset test with various scenarios")

    # Setup
    old_password = "password123!?"
    new_password = "Activist@123!?"

    # 1. User exists and password reset is successful.
    logger.info("Testing password reset email request")
    user = UserFactory(plaintext_password=old_password)
    response = client.post(
        path="/v1/auth/pwreset",
        data={"email": user.email},
    )
    assert response.status_code == 200
    assert len(mail.outbox) == 1
    logger.info(f"Password reset email sent successfully to: {user.email}")

    # 2. Password reset with invalid email.
    response = client.post(
        path="/v1/auth/pwreset", data={"email": "invalid_email@example.com"}
    )
    assert response.status_code == 404

    # 4. Password reset with invalid verification code.
    response = client.post(
        path="/v1/auth/pwreset/invalid_code",
        data={"password": new_password},
    )
    assert response.status_code == 404
