# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from events.factories import EventFlagFactory

pytestmark = pytest.mark.django_db


def test_event_flag_retrieve(authenticated_client):
    client, user = authenticated_client
    flag = EventFlagFactory()

    response = client.get(path=f"/v1/events/event_flags/{flag.id}")

    assert response.status_code == 200


def test_event_flag_retrieve_does_not_exist(authenticated_client):
    client, user = authenticated_client

    flag = uuid4()

    response = client.get(path=f"/v1/events/event_flags/{flag}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
