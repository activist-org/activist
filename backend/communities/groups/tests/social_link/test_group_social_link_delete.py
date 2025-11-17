# SPDX-License-Identifier: AGPL-3.0-or-later

from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_delete_204(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    social_links = GroupSocialLinkFactory(group=group)

    response = client.delete(
        path=f"/v1/communities/group_social_links/{social_links.id}"
    )

    assert response.status_code == 204


def test_group_social_link_delete_404(authenticated_client):
    client, user = authenticated_client

    bad_uuid = uuid4()

    response = client.delete(
        path=f"/v1/communities/group_social_links/{bad_uuid}",
    )

    assert response.status_code == 404


def test_group_social_link_delete_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()
    social_links = GroupSocialLinkFactory(group=group)

    response = client.delete(
        path=f"/v1/communities/group_social_links/{social_links.id}"
    )

    response_body = response.json()
    assert response.status_code == 403
    assert (
        response_body["detail"] == "You are not authorized to delete this social link."
    )
