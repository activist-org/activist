# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_org_flag_list():
    """
    Test to list all Group flags.
    """
    client = APIClient()

    response = client.get(path="/v1/communities/group_flag/")

    assert response.status_code == 200
