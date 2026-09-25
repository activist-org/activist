# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from unittest.mock import MagicMock, patch

import pytest
from django.db.utils import IntegrityError, OperationalError
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_auth_user_flag_created_201(authenticated_client):
    logger.info("Starting test_user_flag_create test")
    client, user = authenticated_client
    flagged_client, flagged_user = authenticated_client

    logger.debug("Creating user flag")
    response = client.post(
        path="/v1/auth/user_flags",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    assert response.status_code == status.HTTP_201_CREATED
    logger.info(f"User flag created successfully, status: {response.status_code}")


def test_auth_user_flag_create_unauthorized_401():
    logger.info("Starting test_user_flag_create_error test")
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()
    logger.debug(f"Created test user: {test_username}")

    flagged_user = UserFactory(
        username="flagged_user", is_confirmed=True, verified=True
    )
    logger.debug(f"Created flagged user: {flagged_user.username}")

    logger.debug("Attempting user flag creation without authentication")
    response = client.post(
        path="/v1/auth/user_flags",
        data={"user": flagged_user.id, "created_by": user.id},
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response_body["detail"] == "Authentication credentials were not provided."
    logger.info(
        f"Authentication error correctly returned, status: {response.status_code}"
    )


@pytest.mark.parametrize("database_error", [IntegrityError, OperationalError])
def test_auth_user_flag_create_database_error_bad_request_400(
    authenticated_client, database_error
):
    client, user = authenticated_client
    serializer = MagicMock()
    serializer.is_valid.return_value = None
    serializer.save.side_effect = database_error("Database error")
    serializer_class = MagicMock(return_value=serializer)

    with patch(
        "authentication.views.UserFlagAPIView.get_serializer_class",
        return_value=serializer_class,
    ):
        response = client.post(
            path="/v1/auth/user_flags",
            data={"user": user.id, "created_by": user.id},
        )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data["detail"] == "Failed to create flag."
