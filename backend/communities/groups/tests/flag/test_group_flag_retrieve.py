# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.groups.factories import GroupFlagFactory

pytestmark = pytest.mark.django_db


def test_group_flag_retrieve_ok_200(authenticated_client):
    """
    Test to retrieve a flag of a group.
    """
    client, user = authenticated_client
    flag = GroupFlagFactory()

    response = client.get(path=f"/v1/communities/group_flags/{flag.id}")

    assert response.status_code == status.HTTP_200_OK


def test_group_flag_retrieve_not_found_404(authenticated_client):
    client, user = authenticated_client

    flag = uuid4()

    response = client.get(path=f"/v1/communities/group_flags/{flag}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Failed to retrieve the flag."
