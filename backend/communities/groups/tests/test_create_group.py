import pytest
from django.test import Client

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_create_group(client: Client) -> None:
    group = GroupFactory.create()

    response = client.post(path="/v1/communities/groups/", data={"data": group})

    assert response.status_code == 201
