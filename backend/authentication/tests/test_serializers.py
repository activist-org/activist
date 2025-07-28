# SPDX-License-Identifier: AGPL-3.0-or-later

"""
Tests for serializers in the authentication app.
"""

# mypy: ignore-errors
import logging
import uuid
from unittest.mock import patch

import pytest

from authentication.factories import UserFactory
from authentication.serializers import (
    DeleteUserResponseSerializer,
    PasswordResetSerializer,
    SignInSerializer,
    SignUpSerializer,
)

logger = logging.getLogger(__name__)


class TestDeleteUserResponseSerializer:
    def test_valid_message(self) -> None:
        logger.info("Testing DeleteUserResponseSerializer with valid message")
        data = {"message": "User deleted successfully."}
        serializer = DeleteUserResponseSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_message_max_length_exceeded(self) -> None:
        logger.info("Testing DeleteUserResponseSerializer with message exceeding max length")
        long_message = "A" * 201  # exceeding 200 characters
        data = {"message": long_message}
        serializer = DeleteUserResponseSerializer(data=data)

        assert not serializer.is_valid()

    def test_missing_message_field(self) -> None:
        logger.info("Testing DeleteUserResponseSerializer with missing message field")
        data: dict = {}
        serializer = DeleteUserResponseSerializer(data=data)

        assert not serializer.is_valid()


@pytest.mark.django_db
class TestSignUpSerializer:
    def test_valid_data(self) -> None:
        logger.info("Testing SignUpSerializer with valid data")
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "StrongPass!123",
            "email": "testuser@example.com",
        }
        serializer = SignUpSerializer(data=data)

        assert serializer.is_valid()

    def test_password_mismatch(self) -> None:
        logger.info("Testing SignUpSerializer with password mismatch")
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "WrongPass!123",
        }
        serializer = SignUpSerializer(data=data)

        assert not serializer.is_valid()
        assert (
            serializer.errors["non_field_errors"][0].code
            == "invalid_password_confirmation"
        )

    def test_weak_password(self) -> None:
        logger.info("Testing SignUpSerializer with weak password")
        data = {
            "username": "testuser",
            "password": "weakpass",
            "password_confirmed": "weakpass",
        }
        serializer = SignUpSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_password"


@pytest.mark.django_db
class TestSignInSerializer:
    """
    Test cases for SignInSerializer.
    """

    @pytest.fixture
    def user(self) -> UserFactory:
        logger.info("Creating test user for SignInSerializer tests")
        return UserFactory.create(
            email="testuser@activist.com",
            username="testuser",
            password="ValidPass!123",
            is_confirmed=True,
        )

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_email(self, mock_authenticate, user) -> None:
        logger.info("Testing SignInSerializer with valid email login")
        mock_authenticate.return_value = user
        data = {"email": "testuser@activist.com", "password": "ValidPass!123"}
        serializer = SignInSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_username(self, mock_authenticate, user) -> None:
        logger.info("Testing SignInSerializer with valid username login")
        mock_authenticate.return_value = user
        data = {"username": "testuser", "password": "ValidPass!123"}
        serializer = SignInSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    def test_invalid_credentials(self, user) -> None:
        logger.info("Testing SignInSerializer with invalid credentials")
        data = {"email": "wrong@activist.com", "password": "WrongPass!123"}
        serializer = SignInSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_credentials"

    @patch("authentication.serializers.authenticate")
    def test_unconfirmed_email(self, mock_authenticate, user) -> None:
        logger.info("Testing SignInSerializer with unconfirmed email")
        mock_authenticate.return_value = user
        user.is_confirmed = False
        user.save()
        data = {"email": "testuser@activist.com", "password": "ValidPass!123"}
        serializer = SignInSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "email_not_confirmed"


@pytest.mark.django_db
class TestPasswordResetSerializer:
    """
    Test cases for PasswordResetSerializer.
    """

    @pytest.fixture
    def user_with_verification(self):
        logger.info("Creating test user with verification code for PasswordResetSerializer tests")
        user = UserFactory.create(
            email="testuser@activist.com", password="oldpassword123"
        )
        verification_code = uuid.uuid4()
        user.verification_code = verification_code
        user.save()

        return user, verification_code

    def test_validate_with_code(self, user_with_verification) -> None:
        logger.info("Testing PasswordResetSerializer with valid verification code")
        user, verification_code = user_with_verification
        serializer = PasswordResetSerializer(
            data={"code": str(verification_code), "password": "newpassword123"}
        )

        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_email(self, user_with_verification) -> None:
        logger.info("Testing PasswordResetSerializer with valid email")
        user, _ = user_with_verification
        serializer = PasswordResetSerializer(
            data={"email": "testuser@activist.com", "password": "newpassword123"}
        )

        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_invalid_code(self, user_with_verification) -> None:
        logger.info("Testing PasswordResetSerializer with invalid verification code")
        _, _ = user_with_verification
        invalid_code = uuid.uuid4()
        serializer = PasswordResetSerializer(
            data={"code": str(invalid_code), "password": "newpassword123"}
        )

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_email"

    def test_validate_with_invalid_email(self, user_with_verification) -> None:
        """
        Test validation with invalid email (tests else branch).
        """
        logger.info("Testing PasswordResetSerializer with invalid email")
        _, _ = user_with_verification
        serializer = PasswordResetSerializer(
            data={"email": "invalid_email@activist.com", "password": "newpassword123"}
        )

        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors
        assert serializer.errors["non_field_errors"][0].code == "invalid_email"
