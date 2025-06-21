# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test retrievable group.
"""

import pytest
from django.test import Client

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_retrieve(client: Client) -> None:
    """
    Test retrieving groups.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test does not return any value. It asserts the correctness of HTTP status
        codes and the existence of the group when fetched by its ID.
    """
    group = GroupFactory()
    group_id = group.id

    """
    1. Group ID exists in the database.
    """
    response = client.get(
        path=f"/v1/communities/groups/{group_id}/",
    )

    assert response.status_code == 200
