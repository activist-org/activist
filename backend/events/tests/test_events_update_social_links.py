# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from authentication.factories import UserFactory
from events.factories import EventFactory, EventSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_event_update_social_links(client: Client) -> None:
    """
    Authorized user + owner of the event updates social links for the event.
    """
    test_username = "test_username"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()
    token = login_body["token"]

    event = EventFactory.create()
    event.created_by = user
    event_id = event.id

    links = EventSocialLinkFactory()

    response = client.put(
        path=f"/v1/events/event_social_links/{event_id}/",
        data={
            "link": links.link,
            "label": links.label,
        },
        headers={"Authorization": f"Token {str(token)}"},
        content_type="application/json",
    )

    assert response.status_code == 200
