# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_user_flag_list():
    """
    Test to list all user flags.
    """
    client = APIClient()

    response = client.get(path="/v1/auth/user_flag/")

    assert response.status_code == 200
