# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for email verification methods.
"""

import uuid

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db  # noqa: N999


def test_auth_email_verification_get_valid_code():
    """
    Test email verification with valid code.
    """
    client = APIClient()

    verification_code = str(uuid.uuid4())
    user = UserFactory(
        email="test@example.com",
        verification_code=verification_code,
        is_confirmed=False,
    )

    response = client.get("/v1/auth/sign_up", {"verification_code": verification_code})

    assert response.status_code == 200
    assert response.data["message"] == "Email is confirmed. You can now log in."

    user.refresh_from_db()
    assert user.is_confirmed is True
    assert user.verification_code is None


def test_auth_email_verification_get_invalid_code():
    """
    Test email verification with invalid code.
    """
    client = APIClient()

    verification_code = str(uuid.uuid4())
    user = UserFactory(
        email="test@example.com",
        verification_code=verification_code,
        is_confirmed=False,
    )

    invalid_code = str(uuid.uuid4())
    response = client.get("/v1/auth/sign_up", {"verification_code": invalid_code})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."

    user.refresh_from_db()
    assert user.is_confirmed is False
    assert str(user.verification_code) == verification_code


def test_auth_email_verification_get_nonexistent_code():
    """
    Test email verification with code that doesn't exist.
    """
    client = APIClient()

    nonexistent_code = str(uuid.uuid4())
    response = client.get("/v1/auth/sign_up", {"verification_code": nonexistent_code})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_empty_code():
    """
    Test email verification with empty code.
    """
    client = APIClient()

    response = client.get("/v1/auth/sign_up", {"verification_code": ""})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_malformed_code():
    """
    Test email verification with malformed UUID.
    """
    client = APIClient()

    response = client.get("/v1/auth/sign_up", {"verification_code": "not-a-uuid"})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_already_confirmed():
    """
    Test email verification for already confirmed user.
    """
    client = APIClient()

    verification_code = str(uuid.uuid4())
    user = UserFactory(
        email="test@example.com",
        verification_code=verification_code,
        is_confirmed=True,  # already confirmed
    )

    response = client.get("/v1/auth/sign_up", {"verification_code": verification_code})

    assert response.status_code == 200
    assert response.data["message"] == "Email is confirmed. You can now log in."

    user.refresh_from_db()
    assert user.is_confirmed is True
    assert user.verification_code is None


def test_auth_email_verification_get_user_with_empty_code():
    """
    Test email verification for user with empty verification code.
    """
    client = APIClient()

    UserFactory(
        email="test@example.com",
        verification_code=None,  # None instead of empty string
        is_confirmed=False,
    )

    response = client.get("/v1/auth/sign_up", {"verification_code": ""})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_sql_injection_attempt():
    """
    Test email verification with SQL injection attempt.
    """
    client = APIClient()

    malicious_code = "'; DROP TABLE auth_user; --"
    response = client.get("/v1/auth/sign_up", {"verification_code": malicious_code})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_unicode_characters():
    """
    Test email verification with unicode/emoji characters.
    """
    client = APIClient()

    unicode_code = "🔐🚀💻🎉"
    response = client.get("/v1/auth/sign_up", {"verification_code": unicode_code})

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."


def test_auth_email_verification_get_whitespace_handling():
    """
    Test email verification with whitespace in code.
    """
    client = APIClient()

    verification_code = str(uuid.uuid4())
    UserFactory(
        email="test@example.com",
        verification_code=verification_code,
        is_confirmed=False,
    )

    # Test with leading/trailing whitespace.
    response = client.get(
        "/v1/auth/sign_up", {"verification_code": f"  {verification_code}  "}
    )

    assert response.status_code == 404
    assert response.data["detail"] == "User does not exist."
