import pytest
from django.test import Client

pytestmark = pytest.mark.django_db


def test_discussion_list(client: Client):
    response = client.get(path="/v1/content/discussions/")

    assert response.status_code == 200
