# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client
from rest_framework import status

pytestmark = pytest.mark.django_db


def test_org_list_ok_200(client: Client) -> None:
    response = client.get(path="/v1/communities/organizations")

    assert response.status_code == status.HTTP_200_OK
