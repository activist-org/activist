# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for updating events.
"""

import pytest

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_event_update(authenticated_client) -> None:
    """
    User who is not the owner of the event tries to update.
    """
    client, user = authenticated_client

    event = EventFactory.create()

    response = client.put(
        path=f"/v1/events/events/{event.id}",
        data={
            "name": "test_name",
            "type": "test_type",
            "startTime": event.start_time,
            "endTime": event.end_time,
        },
        content_type="application/json",
    )

    assert response.status_code == 401

    response_body = response.json()
    assert response_body["detail"] == "User not authorized."
