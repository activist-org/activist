# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

pytestmark = pytest.mark.django_db


def test_org_list(client: Client) -> None:
    response = client.get(path="/v1/communities/organizations/")

    assert response.status_code == 200
