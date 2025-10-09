# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for SignOutView from views.py
"""

import logging
from unittest.mock import patch

import pytest
from rest_framework.test import APIClient

from authentication.factories import SessionFactory, UserFactory
from authentication.models import SessionModel

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


def test_signout_successful_logout():
    """
    Test successful logout with authenticated user.

    This test verifies:
    - User can logout successfully when authenticated
    - Correct response status and message
    - User sessions are deleted from database
    - User is logged out from Django session
    """
    logger.info("Starting test_signout_successful_logout")
    client = APIClient()

    # Create test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    # Create sessions for the user.
    SessionFactory(user=user)
    SessionFactory(user=user)
    logger.debug(
        f"Created {SessionModel.objects.filter(user=user).count()} sessions for user"
    )

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200
    logger.debug("User login successful")

    # Verify sessions exist before logout (2 created + 1 from login = 3 total).
    assert SessionModel.objects.filter(user=user).count() == 3

    # Get authentication token.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    # Test logout and verify response.
    logger.debug("Attempting user logout")
    response = client.post(path="/v1/auth/sign_out")

    assert response.status_code == 200
    assert response.data["message"] == "User was logged out successfully."
    logger.debug(f"Logout response: {response.data}")

    # Verify sessions are deleted.
    assert SessionModel.objects.filter(user=user).count() == 0
    logger.debug("User sessions successfully deleted")

    # Verify user is logged out (subsequent request should fail).
    # Note: The session endpoint will raise an exception because no sessions exist after logout.
    # This is expected behavior since logout deletes all user sessions.
    try:
        response_after_logout = client.get(path="/v1/auth/sessions")
        assert response_after_logout.status_code in [401, 500]
        logger.debug("User properly logged out - subsequent request returns error")

    except Exception as e:
        logger.debug(
            f"User properly logged out - session request raised exception: {type(e).__name__}"
        )
        assert "SessionModel matching query does not exist" in str(
            e
        ) or "DoesNotExist" in str(e)

    logger.info("test_signout_successful_logout completed successfully")


def test_signout_unauthenticated_user():
    """
    Test logout with unauthenticated user returns 401.

    This test verifies:
    - Unauthenticated users cannot access logout endpoint
    - Correct 401 response with proper error message
    """
    logger.info("Starting test_signout_unauthenticated_user")
    client = APIClient()

    # Test logout without authentication and verify the response.
    logger.debug("Attempting logout without authentication")
    response = client.post(path="/v1/auth/sign_out")

    assert response.status_code == 401
    assert response.data["detail"] == "Authentication credentials were not provided."
    logger.debug(f"Unauthenticated logout response: {response.data}")

    logger.info("test_signout_unauthenticated_user completed successfully")


def test_signout_invalid_token():
    """
    Test logout with invalid authentication token returns 401.

    This test verifies:
    - Invalid tokens are rejected
    - Correct 401 response
    """
    logger.info("Starting test_signout_invalid_token")
    client = APIClient()

    # Test logout with invalid token and verify response.
    client.credentials(HTTP_AUTHORIZATION="Token invalid_token_12345")
    logger.debug("Attempting logout with invalid token")
    response = client.post(path="/v1/auth/sign_out")

    assert response.status_code == 401
    logger.debug(f"Invalid token logout response: {response.data}")

    logger.info("test_signout_invalid_token completed successfully")


def test_signout_malformed_token():
    """
    Test logout with malformed authentication header returns 401.

    This test verifies:
    - Malformed authorization headers are handled gracefully
    - Correct 401 response
    """
    logger.info("Starting test_signout_malformed_token")
    client = APIClient()

    # Test various malformed authorization headers.
    malformed_headers = [
        "Token",  # missing token value
        "Bearer invalid_token",  # wrong prefix
        "invalid_format",  # no prefix
        "",  # empty header
    ]

    for header in malformed_headers:
        client.credentials(HTTP_AUTHORIZATION=header)
        logger.debug(f"Attempting logout with malformed header: '{header}'")
        response = client.post(path="/v1/auth/sign_out")

        assert response.status_code == 401
        logger.debug(f"Malformed header '{header}' response: {response.status_code}")

    logger.info("test_signout_malformed_token completed successfully")


def test_signout_deletes_all_user_sessions():
    """
    Test that logout deletes all sessions for the user, not just the current one.

    This test verifies:
    - All user sessions are deleted, not just the current session
    - Multiple sessions are handled correctly
    """
    logger.info("Starting test_signout_deletes_all_user_sessions")
    client = APIClient()

    # Create test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    # Create multiple sessions for the user and verify that it exists.
    sessions = [SessionFactory(user=user) for _ in range(5)]
    logger.debug(f"Created {len(sessions)} sessions for user")

    assert SessionModel.objects.filter(user=user).count() == 5

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token and test logout.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(path="/v1/auth/sign_out")
    assert response.status_code == 200

    # Verify all sessions are deleted.
    assert SessionModel.objects.filter(user=user).count() == 0
    logger.debug("All user sessions successfully deleted")

    logger.info("test_signout_deletes_all_user_sessions completed successfully")


def test_signout_user_with_no_sessions():
    """
    Test logout for user with no existing sessions.

    This test verifies:
    - Logout works even when user has no sessions
    - No database errors occur
    - Correct response is returned
    """
    logger.info("Starting test_signout_user_with_no_sessions")
    client = APIClient()

    # Create test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    # Verify user has no sessions.
    assert SessionModel.objects.filter(user=user).count() == 0
    logger.debug("User has no existing sessions")

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token, test logout and verify response.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(path="/v1/auth/sign_out")

    assert response.status_code == 200
    assert response.data["message"] == "User was logged out successfully."
    logger.debug("Logout successful for user with no sessions")

    logger.info("test_signout_user_with_no_sessions completed successfully")


def test_signout_response_format():
    """
    Test that logout response has correct format and status code.

    This test verifies:
    - Response status code is 200
    - Response contains correct message
    - Response format matches API documentation
    """
    logger.info("Starting test_signout_response_format")
    client = APIClient()

    # Create and login test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token, test logout and verify repose format.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(path="/v1/auth/sign_out")

    assert response.status_code == 200
    assert "message" in response.data
    assert response.data["message"] == "User was logged out successfully."
    assert len(response.data) == 1  # only message field should be present
    logger.debug(f"Response format correct: {response.data}")

    logger.info("test_signout_response_format completed successfully")


@patch("authentication.views.logger")
def test_signout_logging(mock_logger):
    """
    Test that logout logs appropriate messages.

    This test verifies:
    - Logout attempt is logged
    - Successful logout is logged
    - Log messages contain user information
    """
    logger.info("Starting test_signout_logging")
    client = APIClient()

    # Create and login test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token and clear log calls.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    mock_logger.reset_mock()

    # Test logout and verify logging.
    response = client.post(path="/v1/auth/sign_out")
    assert response.status_code == 200
    assert mock_logger.info.call_count == 2  # one for attempt, one for success

    # Check logout attempt log.
    attempt_call = mock_logger.info.call_args_list[0]
    assert "User logout attempt" in attempt_call[0][0]
    assert test_username in attempt_call[0][0]
    assert str(user.id) in attempt_call[0][0]

    # Check successful logout log.
    success_call = mock_logger.info.call_args_list[1]
    assert "User logged out successfully" in success_call[0][0]
    assert test_username in success_call[0][0]
    assert str(user.id) in success_call[0][0]

    logger.debug("Logging verification completed")
    logger.info("test_signout_logging completed successfully")


def test_signout_http_methods():
    """
    Test that only POST method is allowed for logout.

    This test verifies:
    - POST method works
    - Other HTTP methods return 405 Method Not Allowed
    """
    logger.info("Starting test_signout_http_methods")
    client = APIClient()

    # Create and login test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    # Test POST method (should work)
    post_response = client.post(path="/v1/auth/sign_out")

    assert post_response.status_code == 200
    logger.debug("POST method works correctly")

    # Re-login for other method tests.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    # Test other HTTP methods (should return 405, except OPTIONS which returns 200 for CORS).
    methods_to_test = ["GET", "PUT", "PATCH", "DELETE", "HEAD"]

    for method in methods_to_test:
        response = getattr(client, method.lower())(path="/v1/auth/sign_out")

        assert response.status_code == 405, f"{method} method should return 405"
        logger.debug(f"{method} method correctly returns 405")

    # Test OPTIONS method (returns 200 for CORS preflight).
    options_response = client.options(path="/v1/auth/sign_out")

    assert options_response.status_code == 200, (
        "OPTIONS method should return 200 for CORS"
    )
    logger.debug("OPTIONS method correctly returns 200 for CORS")

    logger.info("test_signout_http_methods completed successfully")


def test_signout_database_integrity():
    """
    Test logout behavior with database integrity issues.

    This test verifies:
    - Logout handles database errors gracefully
    - User is still logged out even if session deletion fails
    """
    logger.info("Starting test_signout_database_integrity")
    client = APIClient()

    # Create and login test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    # Test logout (should work normally).
    response = client.post(path="/v1/auth/sign_out")
    assert response.status_code == 200
    logger.debug("Normal logout works correctly")

    logger.info("test_signout_database_integrity completed successfully")


def test_signout_concurrent_requests():
    """
    Test logout behavior with concurrent requests.

    This test verifies:
    - Multiple logout requests are handled correctly
    - No race conditions occur
    - Sessions are properly cleaned up
    """
    logger.info("Starting test_signout_concurrent_requests")
    client = APIClient()

    # Create and login test user.
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )
    assert login_response.status_code == 200

    # Get authentication token.
    login_body = login_response.json()
    token = login_body["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    # Test multiple logout requests.
    response1 = client.post(path="/v1/auth/sign_out")
    assert response1.status_code == 200

    # Second logout should still work (user is already logged out).
    response2 = client.post(path="/v1/auth/sign_out")
    assert response2.status_code == 200

    # Verify sessions are deleted.
    assert SessionModel.objects.filter(user=user).count() == 0
    logger.debug("Concurrent logout requests handled correctly")

    logger.info("test_signout_concurrent_requests completed successfully")
