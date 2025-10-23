# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test group_list module.
"""

import pytest
from django.test import Client

pytestmark = pytest.mark.django_db


def test_group_list(client: Client) -> None:
    """
    Test group_list method.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test does not return any value, it only checks the response status code.
    """
    response = client.get(path="/v1/communities/groups")

    assert response.status_code == 200
