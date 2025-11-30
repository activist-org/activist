# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_update(authenticated_client) -> None:
    """
    Test Group Social Link updates.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client

    group = GroupFactory(created_by=user)

    social_links = GroupSocialLinkFactory(group=group)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    response = client.put(
        path=f"/v1/communities/group_social_links/{social_links.id}",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 200
    assert response_body["message"] == "Social link updated successfully."

    # MARK: Update Failure

    test_uuid = uuid4()

    response = client.put(
        path=f"/v1/communities/group_social_links/{test_uuid}",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Social link not found."


def test_group_social_link_not_creator_or_admin(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()

    social_links = GroupSocialLinkFactory(group=group)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    response = client.put(
        path=f"/v1/communities/group_social_links/{social_links.id}",
        data={"link": test_link, "label": test_label, "order": test_order},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update the social links for this group."
    )
