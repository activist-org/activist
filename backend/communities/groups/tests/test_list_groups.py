import pytest
from django.test import Client

pytestmark = pytest.mark.django_db


def test_list_groups(client: Client) -> None:
    """Test case to list all groups."""
    response = client.get(path="/v1/communities/groups/")

    assert response.status_code == 200
