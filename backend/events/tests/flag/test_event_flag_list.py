# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

pytestmark = pytest.mark.django_db


def test_event_flag_list(authenticated_client):
    client, user = authenticated_client
    response = client.get(path="/v1/events/event_flags")

    assert response.status_code == 200
