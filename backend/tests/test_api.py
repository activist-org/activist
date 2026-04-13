import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.mark.django_db
def test_get_events_list(api_client: APIClient) -> None:
    response = api_client.get("/v1/events/events")
    assert response.status_code == 200


@pytest.mark.django_db
def test_unauthenticated_cannot_create_event(api_client: APIClient) -> None:
    response = api_client.post("/v1/events/events", {"name": "Test"}, format="json")
    assert response.status_code == 401
