# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from uuid import uuid4

import pytest

from authentication.factories import UserFlagFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_retrieve(authenticated_client):
    """
    Test to retrieve a flag of a user.
    """
    logger.info("Starting test_user_flag_retrieve")
    client, user = authenticated_client

    flagged_user = UserFlagFactory()
    logger.debug(f"Created flagged user with ID: {flagged_user.id}")

    logger.debug(f"Making API request to retrieve user flag: {flagged_user.id}")
    response = client.get(path=f"/v1/auth/user_flags/{flagged_user.id}")

    assert response.status_code == 200
    logger.info("test_user_flag_retrieve completed successfully")


def test_user_flag_retrieve_does_not_exist(authenticated_client):
    logger.info("Starting test_user_flag_retrieve_does_not_exist")

    client, user = authenticated_client
    flagged_user = uuid4()

    logger.debug(
        f"Making API request to retrieve non-existent user flag: {flagged_user}"
    )
    response = client.get(path=f"/v1/auth/user_flags/{flagged_user}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
    logger.info(
        "test_user_flag_retrieve_does_not_exist completed successfully - 404 error as expected"
    )
