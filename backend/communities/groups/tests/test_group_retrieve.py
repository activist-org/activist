# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test retrievable group.
"""

from uuid import uuid4

import pytest
from django.test import Client
from rest_framework import status

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_retrieve_ok_200(client: Client) -> None:
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
    Group ID exists in the database.
    """
    response = client.get(
        path=f"/v1/communities/groups/{group_id}",
    )

    assert response.status_code == status.HTTP_200_OK


def test_group_retrieve_not_found_404(client: Client):
    """
    Group ID does not exist in the database.
    """
    bad_group_uuid = uuid4()

    response = client.get(path=f"/v1/communities/groups/{bad_group_uuid}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Failed to retrieve the group."

    """
    Group ID is None.
    """

    response = client.get(path=f"/v1/communities/groups/{None}")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Failed to retrieve the group."
