import pytest
from django.test import Client

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_retrieve_group_by_id(client: Client) -> None:
    group = GroupFactory.create()
    group_id = group.id

    response = client.get(path=f"/v1/communities/groups/{group_id}/")

    assert response.status_code == 200
