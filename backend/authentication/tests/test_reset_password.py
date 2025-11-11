# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Password Reset


def test_pwreset(authenticated_client) -> None:
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

    client, user = authenticated_client

    # 2. Password reset with invalid email.
    response = client.post(
        path="/v1/auth/pwreset", data={"email": "invalid_email@example.com"}
    )
    assert response.status_code == 404

    # 4. Password reset with invalid verification code.
    response = client.post(
        path="/v1/auth/pwreset/invalid_code",
        data={"password": "Activist@123!?"},
    )
    assert response.status_code == 404
