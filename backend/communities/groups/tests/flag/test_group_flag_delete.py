# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.groups.factories import GroupFlagFactory

pytestmark = pytest.mark.django_db


def test_group_flag_delete_no_content_204(authenticated_client):
    """
    Test to delete a flag of a group.
    """
    client, user = authenticated_client
    user.is_staff = True
    user.save()
    group_flag = GroupFlagFactory()

    response = client.delete(path=f"/v1/communities/group_flags/{group_flag.id}")
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_group_flag_delete_not_found_404(authenticated_client):
    client, user = authenticated_client

    invalid_flagged_group_flags_id = uuid4()
    response = client.delete(
        path=f"/v1/communities/group_flags/{invalid_flagged_group_flags_id}"
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Flag not found."
