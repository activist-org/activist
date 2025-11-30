# SPDX-License-Identifier: AGPL-3.0-or-later
from unittest.mock import patch

import pytest

pytestmark = pytest.mark.django_db


def test_event_flag_list(authenticated_client):
    client, user = authenticated_client
    response = client.get(path="/v1/events/event_flags")

    assert response.status_code == 200


def test_event_flag_list_no_pagination(authenticated_client):
    """
    Test to list all user flags in case of no pagination.
    """

    client, user = authenticated_client

    with patch(
        "authentication.views.UserFlagAPIView.paginate_queryset"
    ) as mock_paginate:
        mock_paginate.return_value = None

        response = client.get(path="/v1/auth/user_flags")

        assert response.status_code == 200

        # Verify that paginate_queryset was called.
        mock_paginate.assert_called_once()
