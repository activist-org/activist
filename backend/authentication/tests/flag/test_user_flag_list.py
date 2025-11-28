# SPDX-License-Identifier: AGPL-3.0-or-later
import logging

import pytest

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_user_flag_list(authenticated_client):
    """
    Test to list all user flags.
    """

    client, user = authenticated_client

    logger.debug("Making request to user flag endpoint")
    response = client.get(path="/v1/auth/user_flags")

    assert response.status_code == 200
    logger.info("User flag list test completed successfully")
