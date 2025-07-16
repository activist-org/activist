# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

pytestmark = pytest.mark.django_db


def test_event_list(client: Client) -> None:
    """
    List Events.
    """
    response = client.get(path="/v1/events/events")

    assert response.status_code == 200
