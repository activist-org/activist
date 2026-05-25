# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_content_resource_list_ok_200():
    """
    Test to list the resources.
    """
    client = APIClient()

    response = client.get(path="/v1/content/resources")

    assert response.status_code == status.HTTP_200_OK
