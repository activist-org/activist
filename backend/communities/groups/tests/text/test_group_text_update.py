# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupTextFactory

pytestmark = pytest.mark.django_db


def test_group_text_update(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    texts = GroupTextFactory(group=group)

    response = client.put(
        path=f"/v1/communities/group_texts/{texts.id}",
        data={"description": "New test description for this group.", "iso": "en"},
    )

    assert response.status_code == 200


def test_group_text_update_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()
    texts = GroupTextFactory(group=group)

    response = client.put(
        path=f"/v1/communities/group_texts/{texts.id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update to this group's text."
    )


def test_event_text_update_404(authenticated_client):
    client, user = authenticated_client

    bad_texts_id = uuid4()

    response = client.put(
        path=f"/v1/communities/group_texts/{bad_texts_id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Group text not found."
