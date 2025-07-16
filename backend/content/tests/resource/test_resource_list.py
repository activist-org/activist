# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_resource_list():
    """
    Test to list the resources.
    """
    client = APIClient()

    response = client.get(path="/v1/content/resources")

    assert response.status_code == 200
