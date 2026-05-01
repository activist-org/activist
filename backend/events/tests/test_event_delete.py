# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for deleting events.
"""

import pytest
from django.test import Client

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


# MARK: Unauthenticated


def test_event_delete_unauthenticated_401(client: Client) -> None:
    """
    Unauthenticated user receives 401 when trying to delete an event.

    Parameters
    ----------
    client : Client
        An unauthenticated Django test client.
    """
    event = EventFactory.create()

    response = client.delete(
        path=f"/v1/events/events/{event.id}",
    )

    assert response.status_code == 401


# MARK: Non-Owner


def test_event_delete_non_owner_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to delete.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    event = EventFactory.create()

    response = client.delete(
        path=f"/v1/events/events/{event.id}",
    )

    assert response.status_code == 403

    response_body = response.json()
    assert response_body["detail"] == "User not authorized."


# MARK: Owner


def test_event_delete_owner_204(authenticated_client) -> None:
    """
    Owner of the event can successfully delete it.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    event = EventFactory.create(created_by=user)

    response = client.delete(
        path=f"/v1/events/events/{event.id}",
    )

    assert response.status_code == 204
