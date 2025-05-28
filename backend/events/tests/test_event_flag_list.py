import pytest
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db


def test_event_flag_list():
    client = APIClient()

    response = client.get(path="/v1/events/event_flag/")

    assert response.status_code == 200
