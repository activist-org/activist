# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
import uuid
from unittest.mock import patch

import pytest
from django.core.exceptions import ValidationError
from rest_framework import status

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Verify Email


def test_auth_verify_email_ok_200_and_bad_request_400(authenticated_client) -> None:
    """
    Test email verification view.

    This test covers several email verification in two scenarios:
    1) Using a valid code
    2) Using an invalid code
    """
    client, user = authenticated_client
    user.verification_code = uuid.uuid4()
    user.save()

    # Valid verification code.
    logger.info("Testing valid email verification")
    response = client.post(path=f"/v1/auth/verify_email/{user.verification_code}")
    assert response.status_code == status.HTTP_200_OK

    # Invalid verification code.
    logger.info("Testing invalid email verification")
    response = client.post(path="/v1/auth/verify_email/invalid_code")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_auth_verify_email_valid_unmatched_code_not_found_404(
    authenticated_client,
) -> None:
    client, user = authenticated_client
    unmatched_code = uuid.uuid4()

    response = client.post(path=f"/v1/auth/verify_email/{unmatched_code}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "User does not exist."


def test_auth_verify_email_invalid_uuid_query_not_found_404(
    authenticated_client,
) -> None:
    client, user = authenticated_client

    with patch(
        "authentication.views.UserModel.objects.filter",
        side_effect=ValidationError("Invalid verification code"),
    ):
        response = client.post(path=f"/v1/auth/verify_email/{uuid.uuid4()}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.data["detail"] == "User does not exist."
