# SPDX-License-Identifier: AGPL-3.0-or-later
import re
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from events.factories import EventFactory

pytestmark = pytest.mark.django_db


def test_export_events_ics():
    client = APIClient()
    event = EventFactory()

    event_name = re.sub(r"[\t\n\r\f\v]+", " ", event.name)
    event_file_identifier = (
        "".join(filter(str.isalnum, event_name)).replace(" ", "_").lower()
    )

    response = client.get(path="/v1/events/event_calendar", data={"event_id": event.id})

    print(response.content)

    assert response.status_code == 200
    assert response["Content-Type"] == "text/calendar"
    assert b"PRODID:-//Activist//EN" in response.content
    assert (
        f"activist_event_{event_file_identifier}.ics"
        in response["Content-Disposition"].lower()
    )


def test_export_events_ics_400():
    client = APIClient()

    response = client.get(
        path="/v1/events/event_calendar",
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Event ID is required."


def test_export_events_ics_404():
    client = APIClient()
    bad_event_uuid = uuid4()

    response = client.get(
        path="/v1/events/event_calendar", data={"event_id": bad_event_uuid}
    )

    assert response.status_code == 404
