# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import uuid

import pytest
from faker import Faker
from rest_framework.test import APIClient

from authentication.factories import UserFactory

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Verify Email Pwd Reset


def test_verify_email_for_reset_password(client: APIClient) -> None:
    """
    Test email verification view.

    This test covers several reset password verification scenarios:
    1. Valid verification code and new password.
    2. Invalid verification code and new password.

    Parameters
    ----------
    client : APIClient
        An authenticated client.
    """
    logger.info("Starting email verification test with various scenarios")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    new_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )

    user = UserFactory(
        username=username,
        email=email,
        plaintext_password=password,
        is_confirmed=False,
        verification_code=uuid.uuid4(),
    )

    # 1. Valid verification code.
    logger.info("Testing valid email verification")
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}",
        data={"new_password": new_password},
    )
    assert response.status_code == 200

    user.refresh_from_db()
    assert user.check_password(new_password) is True
    assert user.check_password(password) is False
    logger.info(f"Successfully verified email for user: {username}")

    # 2. Invalid verification code.
    logger.info("Testing invalid email verification")
    response = client.post(path="/v1/auth/verify_email_password/invalid_code")
    assert response.status_code == 404

    # 3. Reusing an already used verification code.
    logger.info("Testing reuse of already used verification code")
    response = client.post(
        path=f"/v1/auth/verify_email_password/{user.verification_code}"
    )
    assert response.status_code == 404
