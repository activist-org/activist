# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the authentication app.
"""

# mypy: ignore-errors
import pytest
from authentication.factories import (
    SupportEntityTypeFactory,
    SupportFactory,
    UserFactory,
)
from authentication.models import UserModel

from django.test import Client
from django.core import mail
from faker import Faker

from django.test import Client
from uuid import UUID
import uuid


pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    support_entity_type = SupportEntityTypeFactory.build()
    support = SupportFactory.build()
    user = UserFactory.build()

    assert str(support_entity_type) == support_entity_type.name
    assert str(support) == str(support.id)
    assert str(user) == user.username


def test_sign_up(client: Client) -> None:
    """
    Test the sign up function.

    Scenarios:
    1. Password strength fails
    2. Password confirmation fails
    3. User is created successfully with an email
        - Check response status code
        - Check if user exists in the DB
        - Check if user password is hashed
    4. User already exists
    5. User is created without an email
    """
    fake = Faker()
    username = fake.name()
    second_username = fake.name()
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
    response = client.post(
        path="/v1/auth/sign_up/",
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
        path="/v1/auth/sign_up/",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": wrong_password_confirmed,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert not UserModel.objects.filter(username=username).exists()

    # 3. User is created successfully.
    response = client.post(
        path="/v1/auth/sign_up/",
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

    # 4. User already exists.
    response = client.post(
        path="/v1/auth/sign_up/",
        data={
            "username": username,
            "password": strong_password,
            "password_confirmed": strong_password,
            "email": email,
        },
    )

    assert response.status_code == 400
    assert UserModel.objects.filter(username=username).count() == 1

    # 5. User is created without an email.
    response = client.post(
        path="/v1/auth/sign_up/",
        data={
            "username": second_username,
            "password": strong_password,
            "password_confirmed": strong_password,
        },
    )

    user = UserModel.objects.filter(username=second_username).first()

    assert response.status_code == 201
    assert UserModel.objects.filter(username=second_username).exists()
    assert user.email == ""
    assert user.is_confirmed is False
    assert user.verification_code is None


def test_sign_in(client: Client) -> None:
    """
    Test sign in view.

    Scenarios:
    1. User that signed up with email, that has not confirmed their email
    2. User that signed up with email, confirmed email address. Is logged in successfully
    3. User exists but password is incorrect
    4. User does not exists and tries to sign in
    """
    plaintext_password = "Activist@123!?"
    user = UserFactory(plaintext_password=plaintext_password)

    # 1. User that signed up with email, that has not confirmed their email.
    response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 400

    # 2. User that signed up with email, confirmed email address. Is logged in successfully.
    user.is_confirmed = True
    user.save()
    response = client.post(
        path="/v1/auth/sign_in/",
        data={"email": user.email, "password": plaintext_password},
    )
    assert response.status_code == 200
    # Sign in via username.
    response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": user.username, "password": plaintext_password},
    )
    assert response.status_code == 200

    # 3. User exists but password is incorrect.
    response = client.post(
        path="/v1/auth/sign_in/",
        data={"email": user.email, "password": "Strong_But_Incorrect?!123"},
    )
    assert response.status_code == 400

    # 4. User does not exists and tries to sign in.
    response = client.post(
        path="/v1/auth/sign_in/",
        data={"email": "unknown_user@example.com", "password": "Password@123!?"},
    )
    assert response.status_code == 400


def test_pwreset(client: Client) -> None:
    """
    Test password reset view.

    Scenarios:
    1. Password reset email is sent successfully
    2. Password reset with invalid email
    3. Password reset is performed successfully
    4. Password reset with invalid verification code
    """
    # Setup
    old_password = "password123!?"
    new_password = "Activist@123!?"

    # 1. User exists and password reset is successful.
    user = UserFactory(plaintext_password=old_password)
    response = client.get(
        path="/v1/auth/pwreset/",
        data={"email": user.email},
    )
    assert response.status_code == 200
    assert len(mail.outbox) == 1

    # 2. Password reset with invalid email.
    response = client.get(
        path="/v1/auth/pwreset/", data={"email": "invalid_email@example.com"}
    )
    assert response.status_code == 404

    # 3. Password reset is performed successfully.
    user.verification_code = uuid.uuid4()
    user.save()
    response = client.post(
        path=f"/v1/auth/pwreset/?code={user.verification_code}",
        data={"password": new_password},
    )
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password(new_password)

    # 4. Password reset with invalid verification code.
    response = client.post(
        path="/v1/auth/pwreset/invalid_code/",
        data={"password": new_password},
    )
    assert response.status_code == 404


def test_create_user_and_superuser():
    """
    Test create_user and create_superuser methods of the CustomAccountManager.
    """
    manager = UserModel.objects

    # Test creating a user with email.
    user = manager.create_user(
        username="testuser1",
        password="StrongPassword123$",
        email="test1@example.com",
    )
    assert user.username == "testuser1"
    assert user.email == "test1@example.com"
    assert user.check_password("StrongPassword123$")
    assert not user.is_staff
    assert not user.is_superuser
    assert user.is_active

    # Test creating a user without email.
    user_no_email = manager.create_user(
        username="testuser2",
        password="StrongPassword123$",
    )
    assert user_no_email.username == "testuser2"
    assert user_no_email.email == ""

    # Test creating a superuser with all required flags.
    superuser = manager.create_superuser(
        email="admin@example.com",
        username="admin",
        password="AdminPassword123$",
    )
    assert superuser.username == "admin"
    assert superuser.email == "admin@example.com"
    assert superuser.is_staff
    assert superuser.is_superuser
    assert superuser.is_active

    # Test that creating a superuser with is_staff=False raises the expected error.
    with pytest.raises(ValueError, match="Superuser must be assigned to is_staff=True."):
        manager.create_superuser(
            email="admin2@example.com",
            username="admin2",
            password="AdminPassword123$",
            is_staff=False,
        )

    # Test that creating a superuser with is_superuser=False raises the expected error.
    with pytest.raises(ValueError, match="Superuser must be assigned to is_superuser=True."):
        manager.create_superuser(
            email="admin3@example.com",
            username="admin3",
            password="AdminPassword123$",
            is_superuser=False,
        )


def test_delete_user(client: Client) -> None:
    """
    Test the deletion of existing user records from the database.
    """
    test_username = "test_user_123"
    test_pass = "Activist@123!?"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.save()

    response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": user.username, "password": user.password},
    )

    if response.status_code == 200:
        delete_response = client.delete(
            path="/v1/auth/delete/",
            data={"pk": user.id}
        )

        assert delete_response.status_code == 200
