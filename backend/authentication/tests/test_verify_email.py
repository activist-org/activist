# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import uuid

import pytest

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Verify Email


def test_verify_email_200_and_400(authenticated_client) -> None:
    """
    Test email verification view.

    This test covers several email verification in two scenarios:
    1) Using a valid code
    2) Using an invalid code
    """
    client, user = authenticated_client
    user.verification_code = uuid.uuid4()
    user.save()

    # Valid verification code.
    logger.info("Testing valid email verification")
    response = client.post(path=f"/v1/auth/verify_email/{user.verification_code}")
    assert response.status_code == 200

    # Invalid verification code.
    logger.info("Testing invalid email verification")
    response = client.post(path="/v1/auth/verify_email/invalid_code")
    assert response.status_code == 404
