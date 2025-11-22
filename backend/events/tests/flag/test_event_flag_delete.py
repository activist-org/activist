# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from events.factories import EventFlagFactory

pytestmark = pytest.mark.django_db


def test_event_flag_delete(authenticated_client):
    client, user = authenticated_client
    user.is_staff = True
    user.save()
    flag = EventFlagFactory()

    response = client.delete(path=f"/v1/events/event_flags/{flag.id}")

    assert response.status_code == 204


def test_event_flag_delete_does_not_exist(authenticated_client):
    client, user = authenticated_client

    bad_flagged_event_uuid = uuid4()
    response = client.delete(path=f"/v1/events/event_flags/{bad_flagged_event_uuid}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Flag not found."
