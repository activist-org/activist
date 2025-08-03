# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

from uuid import uuid4

import pytest
from django.test import Client
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFactory, EventSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_event_social_link_update(client: Client) -> None:
    """
    Test Event Social Link updates.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    event = EventFactory(created_by=user)

    social_links = EventSocialLinkFactory(event=event)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    # MARK: Update Success

    login_body = login.json()
    token = login_body["token"]

    response = client.put(
        path=f"/v1/events/event_social_links/{social_links.id}",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 200
    assert response_body["message"] == "Social link updated successfully."

    # MARK: Update Failure

    test_uuid = uuid4()

    response = client.put(
        path=f"/v1/events/event_social_links/{test_uuid}",
        data={
            "link": test_link,
            "label": test_label,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Social link not found."


def test_event_social_link_not_creator_or_admin():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    event = EventFactory()

    social_links = EventSocialLinkFactory(event=event)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    # MARK: Access Failure

    login_body = login_response.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(
        path=f"/v1/events/event_social_links/{social_links.id}",
        data={"link": test_link, "label": test_label, "order": test_order},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update the social links for this event."
    )
