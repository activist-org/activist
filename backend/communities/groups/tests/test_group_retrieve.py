# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_retrieve_groups(client: Client) -> None:
    group = GroupFactory()
    group_id = group.id

    """
    1. Group ID exists in the database.
    """

    response = client.get(
        path=f"/v1/communities/groups/{group_id}/",
    )

    assert response.status_code == 200
