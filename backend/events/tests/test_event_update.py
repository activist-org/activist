# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for updating events.
"""

import pytest
from django.test import Client
from rest_framework import status

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


# MARK: Unauthenticated


def test_event_update_unauthenticated_unauthorized_401(client: Client) -> None:
    """
    Unauthenticated user receives 401 when trying to update an event.

    Parameters
    ----------
    client : Client
        An unauthenticated Django test client.
    """
    event = EventFactory.create()

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"name": "updated_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


# MARK: Non-Owner


def test_event_update_non_owner_forbidden_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to update.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    event = EventFactory.create()

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={
            "name": "test_name",
            "type": "test_type",
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN

    response_body = response.json()
    assert response_body["detail"] == "User not authorized."


# MARK: Owner


def test_event_update_owner_ok_200(authenticated_client) -> None:
    """
    Owner of the event can successfully update it.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    event = EventFactory.create(created_by=user)

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={"name": "updated_event_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK

    response_body = response.json()
    assert response_body["name"] == "updated_event_name"
