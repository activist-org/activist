# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for retrieving events.
"""

import pytest
from django.test import Client
from rest_framework import status

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_retrieve_ok_200(client: Client) -> None:
    """
    Retrieve event using event ID.
    """
    event = EventFactory()

    response = client.get(path=f"/v1/events/events/{event.id}")

    assert response.status_code == status.HTTP_200_OK
