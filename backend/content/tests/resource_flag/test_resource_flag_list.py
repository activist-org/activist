# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db

def test_resource_flag_list():
    client = APIClient()

    response = client.get(path="/v1/content/resource_flag/")

    assert response.status_code == 200
