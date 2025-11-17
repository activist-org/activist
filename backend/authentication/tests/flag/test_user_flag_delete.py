# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from uuid import uuid4

import pytest

from authentication.factories import UserFlagFactory

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_delete(authenticated_client):
    """
    Test to delete a flag of a user.
    """
    logger.info("Starting test_user_flag_delete")
    client, user = authenticated_client
    user.is_staff = True
    user.save()
    logger.debug(f"Test user created with ID: {user.id}")

    logger.debug("Creating flagged user for deletion test")
    flagged_user = UserFlagFactory()
    logger.debug(f"Flagged user created with ID: {flagged_user.id}")

    logger.debug(f"Attempting to delete user flag with ID: {flagged_user.id}")
    response = client.delete(path=f"/v1/auth/user_flags/{flagged_user.id}")

    assert response.status_code == 204
    logger.info("User flag deletion test completed successfully")


def test_user_flag_delete_does_not_exist(authenticated_client):
    logger.info("Starting test_user_flag_delete_does_not_exist")

    client, user = authenticated_client
    bad_flagged_user_uuid = uuid4()

    logger.info(
        f"Deleting flag non existent user with the following uuid: {bad_flagged_user_uuid}"
    )
    response = client.delete(path=f"/v1/auth/user_flags/{bad_flagged_user_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
    logger.info("User flag deletion test for non-existent flag completed successfully")
