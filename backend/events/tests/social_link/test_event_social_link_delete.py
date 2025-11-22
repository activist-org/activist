# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from events.factories import EventFactory, EventSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_social_link_delete(authenticated_client):
    client, user = authenticated_client

    event = EventFactory(created_by=user)
    social_links = EventSocialLinkFactory(event=event)

    response = client.delete(
        path=f"/v1/events/event_social_links/{social_links.id}",
    )

    assert response.status_code == 204


def test_social_link_delete_404(authenticated_client):
    client, user = authenticated_client

    bad_uuid = uuid4()

    response = client.delete(
        path=f"/v1/events/event_social_links/{bad_uuid}",
    )

    assert response.status_code == 404
