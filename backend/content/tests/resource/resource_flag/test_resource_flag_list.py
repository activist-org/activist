# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest

pytestmark = pytest.mark.django_db


def test_resource_flag_list(authenticated_client):
    client, user = authenticated_client

    response = client.get(path="/v1/content/resource_flags")

    assert response.status_code == 200
