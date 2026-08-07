# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

from uuid import uuid4

import pytest
from rest_framework import status

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_update_ok_200_and_not_found_404(
    authenticated_client,
) -> None:
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

    assert response.status_code == status.HTTP_200_OK
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

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Social link not found."


def test_group_social_link_update_forbidden_403(
    authenticated_client,
):
    client, user = authenticated_client

    group_owner = UserFactory()
    group = GroupFactory(created_by=group_owner)

    social_links = GroupSocialLinkFactory(group=group)
    original_values = (social_links.link, social_links.label, social_links.order)

    response = client.put(
        path=f"/v1/communities/group_social_links/{social_links.id}",
        data={
            "link": "https://example.com/updated-social-link",
            "label": "Updated label",
            "order": social_links.order + 1,
        },
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to update the social links for this group."
    )
    social_links.refresh_from_db()
    assert (
        social_links.link,
        social_links.label,
        social_links.order,
    ) == original_values
