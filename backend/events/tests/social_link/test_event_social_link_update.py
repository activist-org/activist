# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

from uuid import uuid4

import pytest
from rest_framework import status

from events.factories import EventFactory, EventSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_event_social_link_update_ok_200(authenticated_client) -> None:
    """
    Test Event Social Link updates.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client

    event = EventFactory(created_by=user)

    social_links = EventSocialLinkFactory(event=event)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    response = client.put(
        path=f"/v1/events/event_social_links/{social_links.id}",
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


def test_event_social_link_update(authenticated_client):
    client, user = authenticated_client
    test_uuid = uuid4()

    event = EventFactory(created_by=user)

    social_links = EventSocialLinkFactory(event=event)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order
    response = client.put(
        path=f"/v1/events/event_social_links/{test_uuid}",
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


def test_event_social_link_update_not_creator_or_admin_forbidden_403(
    authenticated_client,
):
    client, user = authenticated_client

    event = EventFactory()

    social_links = EventSocialLinkFactory(event=event)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    response = client.put(
        path=f"/v1/events/event_social_links/{social_links.id}",
        data={"link": test_link, "label": test_label, "order": test_order},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to update the social links for this event."
    )
