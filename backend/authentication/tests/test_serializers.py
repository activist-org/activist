# SPDX-License-Identifier: AGPL-3.0-or-later

"""
Tests for serializers in the authentication app.
"""

# mypy: ignore-errors
import uuid
from unittest.mock import patch

import pytest

from authentication.factories import UserFactory
from authentication.serializers import (
    DeleteUserResponseSerializer,
    LoginSerializer,
    PasswordResetSerializer,
    SignupSerializer,
)


class TestDeleteUserResponseSerializer:
    """
    Delete user response serializer.
    """

    def test_valid_message(self) -> None:
        """
        Validate correct response message.
        """
        data = {"message": "User deleted successfully."}
        serializer = DeleteUserResponseSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_message_max_length_exceeded(self) -> None:
        """
        Ensure error when message exceeds maximum length (200 characters).
        """
        long_message = "A" * 201  # exceeding 200 characters
        data = {"message": long_message}
        serializer = DeleteUserResponseSerializer(data=data)

        assert not serializer.is_valid()

    def test_missing_message_field(self) -> None:
        """
        Check if serializer handles missing 'message' field.
        """
        data: dict = {}
        serializer = DeleteUserResponseSerializer(data=data)

        assert not serializer.is_valid()


@pytest.mark.django_db
class TestSignupSerializer:
    """
    Tests for signup serializer.
    """

    def test_valid_data(self) -> None:
        """
        Ensure valid registration with correct data (username, email, password).
        """
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "StrongPass!123",
            "email": "testuser@example.com",
        }
        serializer = SignupSerializer(data=data)

        assert serializer.is_valid()

    def test_password_mismatch(self) -> None:
        """
        Validate error when password confirmation does not match.
        """
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "WrongPass!123",
        }
        serializer = SignupSerializer(data=data)

        assert not serializer.is_valid()
        assert (
            serializer.errors["non_field_errors"][0].code
            == "invalid_password_confirmation"
        )

    def test_weak_password(self) -> None:
        """
        Validate error for weak passwords that don't meet security requirements.
        """
        data = {
            "username": "testuser",
            "password": "weakpass",
            "password_confirmed": "weakpass",
        }
        serializer = SignupSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_password"


@pytest.mark.django_db
class TestLoginSerializer:
    """
    Test cases for LoginSerializer.
    """

    @pytest.fixture
    def user(self) -> UserFactory:
        """
        Create a test user with a password and a username.

        Returns
        -------
        UserFactory
            Returns a test user.
        """
        return UserFactory.create(
            email="testuser@activist.com",
            username="testuser",
            password="ValidPass!123",
            is_confirmed=True,
        )

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_email(self, mock_authenticate, user) -> None:
        """
        Ensure login works with email.

        Parameters
        ----------
        mock_authenticate : MagicMock
            Mock authenticate.
        user : UserFactory
            Bring test-user from UserFactory.
        """
        mock_authenticate.return_value = user
        data = {"email": "testuser@activist.com", "password": "ValidPass!123"}
        serializer = LoginSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_username(self, mock_authenticate, user) -> None:
        """
        Ensure login works with username.

        Parameters
        ----------
        mock_authenticate : MagicMock
            Mock_authenticate.
        user : UserFactory
            Bring test-user from UserFactory.
        """
        mock_authenticate.return_value = user
        data = {"username": "testuser", "password": "ValidPass!123"}
        serializer = LoginSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    def test_invalid_credentials(self, user) -> None:
        """
        Ensure error for invalid credentials.

        Parameters
        ----------
        user : UserFactory
            Test user with invalid data.
        """
        data = {"email": "wrong@activist.com", "password": "WrongPass!123"}
        serializer = LoginSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_credentials"

    @patch("authentication.serializers.authenticate")
    def test_unconfirmed_email(self, mock_authenticate, user) -> None:
        """
        Ensure error for login attempt with an unconfirmed email.

        Parameters
        ----------
        mock_authenticate : MagicMock
            Test mock_authenticate user with unconfirmed email.
        user : UserFactory
            A test user with valid data.
        """
        mock_authenticate.return_value = user
        user.is_confirmed = False
        user.save()
        data = {"email": "testuser@activist.com", "password": "ValidPass!123"}
        serializer = LoginSerializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "email_not_confirmed"


@pytest.mark.django_db
class TestPasswordResetSerializer:
    """
    Test cases for PasswordResetSerializer.
    """

    @pytest.fixture
    def user_with_verification(self):
        """
        Create a test user with a password and a verification email.

        Returns
        -------
        UserFactory
            Returns a test user.
        """
        user = UserFactory.create(
            email="testuser@activist.com", password="oldpassword123"
        )
        verification_code = uuid.uuid4()
        user.verification_code = verification_code
        user.save()

        return user, verification_code

    def test_validate_with_code(self, user_with_verification) -> None:
        """
        Validate password reset when correct verification code is provided.

        Parameters
        ----------
        user_with_verification : UserFactory
            A test user with verification code.
        """
        user, verification_code = user_with_verification
        serializer = PasswordResetSerializer(
            data={"code": str(verification_code), "password": "newpassword123"}
        )

        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_email(self, user_with_verification) -> None:
        """
        Ensure password reset works with email.

        Parameters
        ----------
        user_with_verification : UserFactory
            Test user with verification code.
        """
        user, _ = user_with_verification
        serializer = PasswordResetSerializer(
            data={"email": "testuser@activist.com", "password": "newpassword123"}
        )

        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_invalid_code(self, user_with_verification) -> None:
        """
        Ensure error for invalid verification code.

        Parameters
        ----------
        user_with_verification : UserFactory
            A test user with verification code with invalid code.
        """
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

        Parameters
        ----------
        user_with_verification : UserFactory
            Test user with verification code with invalid email.
        """
        _, _ = user_with_verification
        serializer = PasswordResetSerializer(
            data={"email": "invalid_email@activist.com", "password": "newpassword123"}
        )

        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors
        assert serializer.errors["non_field_errors"][0].code == "invalid_email"
