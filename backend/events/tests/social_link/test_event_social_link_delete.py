# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from events.factories import EventFactory, EventSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_event_social_link_delete_no_content_204(authenticated_client):
    client, user = authenticated_client

    event = EventFactory(created_by=user)
    social_links = EventSocialLinkFactory(event=event)

    response = client.delete(
        path=f"/v1/events/event_social_links/{social_links.id}",
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_event_social_link_delete_not_found_404(authenticated_client):
    client, user = authenticated_client

    bad_uuid = uuid4()

    response = client.delete(
        path=f"/v1/events/event_social_links/{bad_uuid}",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_event_social_link_delete_forbidden_403(authenticated_client) -> None:
    """
    Test Event social link deletion by unauthorized user.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the Django test client and the authenticated user.

    Returns
    -------
    None
        This test asserts that users who are neither the creator nor staff
        cannot delete a social link (status 403).
    """
    client, user = authenticated_client
    user.is_staff = False
    user.save()

    # Create an event with a different creator.
    event = EventFactory()
    social_links = EventSocialLinkFactory(event=event)

    test_id = social_links.id

    response = client.delete(
        path=f"/v1/events/event_social_links/{test_id}",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response.data["detail"] == "You are not authorized to delete this social link."
    )
