# SPDX-License-Identifier: AGPL-3.0-or-later
import logging
from unittest.mock import patch

import pytest
from rest_framework import status

logger = logging.getLogger(__name__)
pytestmark = pytest.mark.django_db


def test_auth_user_flag_list_ok_200(authenticated_client):
    """
    Test to list all user flags.
    """

    client, user = authenticated_client

    logger.debug("Making request to user flag endpoint")
    response = client.get(path="/v1/auth/user_flags")

    assert response.status_code == status.HTTP_200_OK
    logger.info("User flag list test completed successfully")


def test_auth_user_flag_list_no_pagination_ok_200(authenticated_client):
    """
    Test list all user flags in case of no pagination.
    """

    client, user = authenticated_client

    with patch(
        "authentication.views.UserFlagAPIView.paginate_queryset"
    ) as mock_paginate:
        mock_paginate.return_value = None

        logger.debug("Making request to user flag endpoint")
        response = client.get(path="/v1/auth/user_flags")

        assert response.status_code == status.HTTP_200_OK

        # Verify that paginate_queryset was called.
        mock_paginate.assert_called_once()
        logger.info("User flag list test completed successfully")
