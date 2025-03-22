__author__ = "narmadha-raghu"

import uuid
from unittest.mock import patch

from django.test import TestCase

from authentication.serializers import PasswordResetSerializer, DeleteUserResponseSerializer, SignupSerializer, \
    LoginSerializer
from authentication.models import UserModel


class TestDeleteUserResponseSerializer(TestCase):

    def test_valid_message(self):
        data = {"message": "User deleted successfully."}
        serializer = DeleteUserResponseSerializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, data)

    def test_message_max_length_exceeded(self):
        long_message = "A" * 201  # Exceeding 200 characters
        data = {"message": long_message}
        serializer = DeleteUserResponseSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_missing_message_field(self):
        data = {}
        serializer = DeleteUserResponseSerializer(data=data)
        self.assertFalse(serializer.is_valid())


class TestSignupSerializer(TestCase):

    def test_valid_data(self):
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "StrongPass!123",
            "email": "testuser@example.com"
        }
        serializer = SignupSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_password_mismatch(self):
        data = {
            "username": "testuser",
            "password": "StrongPass!123",
            "password_confirmed": "WrongPass!123"
        }
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors['non_field_errors'][0].code,
            'invalid_password_confirmation'
        )

    def test_weak_password(self):
        data = {
            "username": "testuser",
            "password": "weakpass",
            "password_confirmed": "weakpass"
        }
        serializer = SignupSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors['non_field_errors'][0].code,
            'invalid_password'
        )


class TestLoginSerializer(TestCase):
    """
    Test cases for LoginSerializer.
    """

    def setUp(self):
        self.user = UserModel.objects.create_user(
            username="testuser",
            email="testuser@activist.com",
            password="ValidPass!123",
            is_confirmed=True
        )

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_email(self, mock_authenticate):
        mock_authenticate.return_value = self.user
        data = {
            "email": "testuser@activist.com",
            "password": "ValidPass!123"
        }
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["user"], self.user)

    @patch("authentication.serializers.authenticate")
    def test_valid_login_with_username(self, mock_authenticate):
        mock_authenticate.return_value = self.user
        data = {
            "username": "testuser",
            "password": "ValidPass!123"
        }
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["user"], self.user)

    def test_invalid_credentials(self):
        data = {
            "email": "wrong@activist.com",
            "password": "WrongPass!123"
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertTrue(
            serializer.errors["non_field_errors"][0].code == "invalid_credentials")

    def test_unconfirmed_email(self):
        self.user.is_confirmed = False
        self.user.save()

        data = {
            "email": "testuser@activist.com",
            "password": "ValidPass!123"
        }
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertTrue(serializer.errors["non_field_errors"][0].code == "email_not_confirmed")


class TestPasswordResetSerializerTest(TestCase):
    """
    Test cases for PasswordResetSerializer.
    """

    def setUp(self):
        """Set up test data."""
        self.user = UserModel.objects.create_user(
            username='testuser',
            email='testuser@activist.com',
            password='oldpassword123'
        )
        self.verification_code = uuid.uuid4()
        self.user.verification_code = self.verification_code
        self.user.save()

    def test_validate_with_code(self):
        serializer = PasswordResetSerializer(data={
            'code': str(self.verification_code),
            'password': 'newpassword123'
        })

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.user)

    def test_validate_with_email(self):
        serializer = PasswordResetSerializer(data={
            'email': 'testuser@activist.com',
            'password': 'newpassword123'
        })
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.user)

    def test_validate_with_invalid_code(self):
        invalid_code = uuid.uuid4()
        serializer = PasswordResetSerializer(data={
            'code': str(invalid_code),
            'password': 'newpassword123'
        })
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors['non_field_errors'][0].code,
            'invalid_email'
        )

    def test_validate_with_invalid_email(self):
        """Test validation with invalid email (tests else branch). """
        serializer = PasswordResetSerializer(data={
            'email': 'invalid_email@activist.com',
            'password': 'newpassword123'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(
            serializer.errors['non_field_errors'][0].code,
            'invalid_email'
        )
