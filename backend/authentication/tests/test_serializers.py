__author__ = "narmadha-raghu"

import pytest
import uuid
from unittest.mock import patch

from authentication.factories import UserFactory
from authentication.serializers import PasswordResetSerializer, DeleteUserResponseSerializer, SignupSerializer, \
    LoginSerializer


class TestDeleteUserResponseSerializer:
    def test_valid_message(self):
        data = {"message": "User deleted successfully."}
        serializer = DeleteUserResponseSerializer(data=data)

        assert serializer.is_valid()
        assert serializer.validated_data == data

    def test_message_max_length_exceeded(self):
        long_message = "A" * 201  # Exceeding 200 characters
        data = {"message": long_message}
        serializer = DeleteUserResponseSerializer(data=data)
        assert not serializer.is_valid()

    def test_missing_message_field(self):
        data = {}
        serializer = DeleteUserResponseSerializer(data=data)
        assert not serializer.is_valid()


@pytest.mark.django_db
class TestSignupSerializer:
    def test_valid_data(self):
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "StrongPass!123",
            "email": "testuser@example.com"
        }
        serializer = SignupSerializer(data=data)
        assert serializer.is_valid()

    def test_password_mismatch(self):
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "WrongPass!123"
        }
        serializer = SignupSerializer(data=data)
        assert not serializer.is_valid()
        assert serializer.errors['non_field_errors'][0].code == 'invalid_password_confirmation'

    def test_weak_password(self):
        data = {
            "username": "testuser",
            "password": "weakpass",
            "password_confirmed": "weakpass"
        }
        serializer = SignupSerializer(data=data)
        assert not serializer.is_valid()
        assert serializer.errors['non_field_errors'][0].code == 'invalid_password'


@pytest.mark.django_db
class TestLoginSerializer:
    """
    Test cases for LoginSerializer.
    """

    @pytest.fixture
    def user(self):
        return UserFactory.create(email="testuser@activist.com", username="testuser", password="ValidPass!123", is_confirmed=True)

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_email(self, mock_authenticate, user):
        mock_authenticate.return_value = user
        data = {
            "email": "testuser@activist.com",
            "password": "ValidPass!123"
        }
        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_username(self, mock_authenticate, user):
        mock_authenticate.return_value = user
        data = {
            "username": "testuser",
            "password": "ValidPass!123"
        }
        serializer = LoginSerializer(data=data)
        assert serializer.is_valid()
        assert serializer.validated_data["user"] == user

    def test_invalid_credentials(self, user):
        data = {
            "email": "wrong@activist.com",
            "password": "WrongPass!123"
        }
        serializer = LoginSerializer(data=data)
        assert not serializer.is_valid()
        assert serializer.errors["non_field_errors"][0].code == "invalid_credentials"

    @patch("authentication.serializers.authenticate")
    def test_unconfirmed_email(self, mock_authenticate, user):
        mock_authenticate.return_value = user
        user.is_confirmed = False
        user.save()
        data = {
            "email": "testuser@activist.com",
            "password": "ValidPass!123"
        }
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
        user = UserFactory.create(email='testuser@activist.com', password='oldpassword123')
        verification_code = uuid.uuid4()
        user.verification_code = verification_code
        user.save()
        return user, verification_code

    def test_validate_with_code(self, user_with_verification):
        user, verification_code = user_with_verification
        serializer = PasswordResetSerializer(data={
            'code': str(verification_code),
            'password': 'newpassword123'
        })

        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_email(self, user_with_verification):
        user, _ = user_with_verification
        serializer = PasswordResetSerializer(data={
            'email': 'testuser@activist.com',
            'password': 'newpassword123'
        })
        assert serializer.is_valid()
        assert serializer.validated_data == user

    def test_validate_with_invalid_code(self, user_with_verification):
        _, _ = user_with_verification
        invalid_code = uuid.uuid4()
        serializer = PasswordResetSerializer(data={
            'code': str(invalid_code),
            'password': 'newpassword123'
        })
        assert not serializer.is_valid()
        assert serializer.errors['non_field_errors'][0].code == 'invalid_email'

    def test_validate_with_invalid_email(self, user_with_verification):
        """Test validation with invalid email (tests else branch). """
        _, _ = user_with_verification
        serializer = PasswordResetSerializer(data={
            'email': 'invalid_email@activist.com',
            'password': 'newpassword123'
        })
        assert not serializer.is_valid()
        assert 'non_field_errors' in serializer.errors
        assert serializer.errors['non_field_errors'][0].code == 'invalid_email'
