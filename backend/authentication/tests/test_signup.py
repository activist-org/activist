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


def test_sign_up_with_weak_password(client: APIClient) -> None:
    """
    Test that sign-up fails when password is too weak.

    Parameters
    ----------
    client : APIClient
        An API client.
    """
    logger.info("Testing password strength validation")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    weak_password = fake.password(
        length=8, special_chars=False, digits=False, upper_case=False
    )

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


def test_sign_up_with_password_mismatch(client: APIClient) -> None:
    """
    Test that sign-up fails when passwords don't match.

    Parameters
    ----------
    client : APIClient
        An API client.
    """
    logger.info("Testing password confirmation validation")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )
    wrong_password_confirmed = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )

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


def test_sign_up_without_email(client: APIClient) -> None:
    """
    Test that sign-up fails when email is missing.

    Parameters
    ----------
    client : APIClient
        An API client.
    """
    logger.info("Testing sign-up without email")
    fake = Faker()
    username = fake.user_name()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )

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


def test_sign_up_successful(client: APIClient) -> None:
    """
    Test successful user registration.

    Parameters
    ----------
    client : APIClient
        An API client.
    """
    logger.info("Testing successful user creation")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )

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
    assert isinstance(user.verification_code, UUID)
    assert user.is_confirmed is False
    assert len(mail.outbox) == 1
    assert user.password != strong_password
    logger.info(
        f"Successfully created user: {username} with verification code: {user.verification_code}"
    )


def test_sign_up_with_duplicate_user(client: APIClient) -> None:
    """
    Test that sign-up fails when user already exists.

    Parameters
    ----------
    client : APIClient
        An API client.
    """
    logger.info("Testing duplicate user registration")
    fake = Faker()
    username = fake.user_name()
    email = fake.email()
    strong_password = fake.password(
        length=12, special_chars=True, digits=True, upper_case=True
    )

    client.post(
        path="/v1/auth/sign_up",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )

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
