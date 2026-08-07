# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.groups.factories import GroupFactory, GroupTextFactory

pytestmark = pytest.mark.django_db


def test_group_text_update_ok_200(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    group_texts = GroupTextFactory(group=group)

    response = client.put(
        path=f"/v1/communities/group_texts/{group_texts.id}",
        data={"description": "New test description for this group.", "iso": "en"},
    )

    assert response.status_code == status.HTTP_200_OK


def test_group_text_update_forbidden_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()
    group_texts = GroupTextFactory(group=group)
    original_description = group_texts.description

    response = client.put(
        path=f"/v1/communities/group_texts/{group_texts.id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to update to this group's text."
    )
    group_texts.refresh_from_db()
    assert group_texts.description == original_description


def test_group_text_update_not_found_404(authenticated_client):
    client, user = authenticated_client

    invalid_group_texts_id = uuid4()

    response = client.put(
        path=f"/v1/communities/group_texts/{invalid_group_texts_id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Group text not found."
