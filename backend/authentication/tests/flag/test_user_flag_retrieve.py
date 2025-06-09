# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFlagFactory

pytestmark = pytest.mark.django_db


def test_user_flag_retrieve():
    """
    Test to retrieve a flag of a user.
    """
    client = APIClient()

    flagged_user = UserFlagFactory()

    response = client.get(path=f"/v1/auth/user_flag/{flagged_user.id}/")

    assert response.status_code == 200
