# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

pytestmark = pytest.mark.django_db


def test_content_resource_flag_list(authenticated_client):
    client, user = authenticated_client

    response = client.get(path="/v1/content/resource_flags")

    assert response.status_code == status.HTTP_200_OK
