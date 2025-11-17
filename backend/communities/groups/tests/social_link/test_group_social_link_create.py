# SPDX-License-Identifier: AGPL-3.0-or-later

import pytest

from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_create_200(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)

    social_links = GroupSocialLinkFactory(group=group)

    response = client.post(
        path="/v1/communities/group_social_links",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
            "group": group.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == 201
    assert response_body["message"] == "Social link created successfully."


def test_group_social_link_create_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()

    social_links = GroupSocialLinkFactory(group=group)

    response = client.post(
        path="/v1/communities/group_social_links",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
            "group": group.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to create social links for this group."
    )
