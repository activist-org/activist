# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from content.factories import ResourceFlagFactory

pytestmark = pytest.mark.django_db


def test_resource_flag_retrieve(authenticated_client):
    client, user = authenticated_client
    flag = ResourceFlagFactory()

    response = client.get(path=f"/v1/content/resource_flags/{flag.id}")

    assert response.status_code == 200


def test_resource_flag_retrieve_does_not_exist(authenticated_client):
    client, user = authenticated_client
    bad_flagged_resource_uuid = uuid4()

    response = client.get(
        path=f"/v1/content/resource_flags/{bad_flagged_resource_uuid}"
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
