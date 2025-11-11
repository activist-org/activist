# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest

logger = logging.getLogger(__name__)

pytestmark = pytest.mark.django_db


# MARK: Delete User


def test_delete_user_204(authenticated_client) -> None:
    """
    Test the deletion of existing user records from the database.

    Parameters
    ----------
    authenticated_client : APIClient
        An authenticated client.
    """
    logger.info("Starting user deletion test")
    client, user = authenticated_client

    # User deletes themselves.
    logger.info("Testing user self-deletion")
    response = client.delete(path="/v1/auth/delete")

    assert response.status_code == 204
    logger.info("Successfully deleted user")
