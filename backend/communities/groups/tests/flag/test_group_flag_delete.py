# SPDX-License-Identifier: AGPL-3.0-or-later

from uuid import uuid4

import pytest

from communities.groups.factories import GroupFlagFactory

pytestmark = pytest.mark.django_db


def test_group_flag_delete(authenticated_client):
    """
    Test to delete a flag of a group.
    """
    client, user = authenticated_client
    user.is_staff = True
    user.save()
    flag = GroupFlagFactory()

    response = client.delete(path=f"/v1/communities/group_flags/{flag.id}")

    assert response.status_code == 204


def test_group_flag_does_not_exist(authenticated_client):
    client, user = authenticated_client

    bad_flagged_group_uuid = uuid4()
    response = client.delete(
        path=f"/v1/communities/group_flags/{bad_flagged_group_uuid}"
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
