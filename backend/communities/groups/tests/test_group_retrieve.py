# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test retrievable group.
"""

from uuid import uuid4

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
        path=f"/v1/communities/groups/{group_id}",
    )

    assert response.status_code == 200

    """
    2. Group ID does not exist in the database.
    """
    bad_group_uuid = uuid4()

    response = client.get(path=f"/v1/communities/groups/{bad_group_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the group."

    """
    3. Group ID is None.
    """

    response = client.get(path=f"/v1/communities/groups/{None}")

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the group."
