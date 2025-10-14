# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from uuid import UUID

import pytest
from django.core import mail
from faker import Faker
from rest_framework.test import APIClient

from authentication.models import UserModel

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Sign Up


def test_sign_up(client: APIClient) -> None:
    """
    Test the sign-up function.

    This test checks various user registration scenarios:
    - Password too weak
    - Password mismatch
    - Successful registration
    - Duplicate user
    - Missing email

    Parameters
    ----------
    client : Client
        An authenticated client.
    """
    logger.info("Starting sign-up test with various scenarios")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    wrong_password_confirmed = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    weak_password = fake.password(
        length=8, special_chars=False, digits=False, upper_case=False
    )

    # 1. Password strength fails.
    logger.info("Testing password strength validation")
    response = client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": weak_password,
            "password_confirmed": weak_password,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()

    # 2. Password confirmation fails.
    response = client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": wrong_password_confirmed,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()
    # 5. User is not created without an email.
    response = client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
        },
    )

    user = UserModel.objects.filter(username=username).first()
    assert user is None
    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()
    # 3. User is created successfully.
    logger.info("Testing successful user creation")
    response = client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )
    user = UserModel.objects.filter(username=username).first()

    assert response.status_code == 201
    assert UserModel.objects.filter(username=username)
    # Code for Email confirmation is generated and is a UUID.
    assert isinstance(user.verification_code, UUID)
    assert user.is_confirmed is False
    # Confirmation Email was sent.
    assert len(mail.outbox) == 1
    # Assert that the password within the dashboard is hashed and not the original string.
    assert user.password != strong_password
    logger.info(
        f"Successfully created user: {username} with verification code: {user.verification_code}"
    )

    # 4. User already exists.
    response = client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert UserModel.objects.filter(username=username).count() == 1
