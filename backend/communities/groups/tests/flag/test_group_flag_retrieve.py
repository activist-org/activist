# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from communities.groups.factories import GroupFlagFactory

pytestmark = pytest.mark.django_db


def test_group_flag_retrieve():
    """
    Test to retrieve a flag of a group.
    """
    client = APIClient()

    flag = GroupFlagFactory()

    response = client.get(path=f"/v1/communities/group_flag/{flag.id}/")

    assert response.status_code == 200
