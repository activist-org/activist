# SPDX-License-Identifier: AGPL-3.0-or-later
from typing import Any, TypedDict

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import OrganizationFactory
from content.factories import EntityLocationFactory
from events.factories import EventFactory
from events.models import Event

# Endpoint used for these tests:
EVENTS_URL = "/v1/events/events/"


class UserDict(TypedDict):
    user: UserModel
    plaintext_password: str


def create_user(password: str) -> UserDict:
    """
    Create a user. Returns the user and password.
    """
    user = UserFactory.create(plaintext_password=password, is_confirmed=True)
    return {"user": user, "plaintext_password": password}


def login_user(user_data: UserDict) -> dict[Any, Any]:
    """
    Log in a user. Returns the user and token.
    """
    client = APIClient()
    response = client.post(
        "/v1/auth/sign_in/",
        {
            "username": user_data["user"].username,
            "password": user_data["plaintext_password"],
        },
    )
    assert response.status_code == 200
    return {"user": user_data["user"], "token": response.data["token"]}


@pytest.fixture
def logged_in_user() -> dict[Any, Any]:
    """
    Create a user and log in the user.
    """
    return login_user(create_user("Activist@123!?"))


@pytest.mark.django_db
def test_EventListAPIView(logged_in_user) -> None:
    """
    Test OrganizationAPIView

    # GET request

    1. Verify the number of events in the database
    2. Test the list view endpoint
    3. Check if the pagination keys are present
    4. Test if query_param page_size is working properly
    5. Verify the number of events in the response matches the page_size
    6. Check the pagination links in the response

    # POST request

    1. Create a new organization with a valid payload
    2. Verify the response status code is 201 (Created)
    """
    client = APIClient()
    number_of_events = 10
    test_page_size = 1

    # MARK: List GET

    EventFactory.create_batch(number_of_events)
    assert Event.objects.count() == number_of_events

    response = client.get(EVENTS_URL)
    assert response.status_code == 200

    pagination_key = ["count", "next", "previous", "results"]
    assert all(key in response.data for key in pagination_key)

    response = client.get(f"{EVENTS_URL}?pageSize={test_page_size}")
    assert response.status_code == 200

    assert len(response.data["results"]) == test_page_size
    assert response.data["previous"] is None
    assert response.data["next"] is not None

    # MARK: List POST

    # Not Authenticated.
    response = client.post(EVENTS_URL)
    assert response.status_code == 401

    # Authenticated and successful.
    org = OrganizationFactory.create(org_name="test_org", terms_checked=True)
    new_event = EventFactory.build(name="new_event", terms_checked=True)
    location = EntityLocationFactory.build()
    token = logged_in_user["token"]

    payload = {
        "name": new_event.name,
        "org_id": org.id,
        "tagline": new_event.tagline,
        "offline_location": {
            "lat": location.lat,
            "lon": location.lon,
            "bbox": location.bbox,
            "display_name": location.display_name,
        },
        "type": new_event.type,
        "start_time": new_event.start_time,
        "end_time": new_event.end_time,
        "terms_checked": new_event.terms_checked,
        "setting": "offline",
    }

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(EVENTS_URL, data=payload, format="json")

    assert response.status_code == 201
    assert Event.objects.filter(name=new_event.name).exists()


@pytest.mark.django_db
def test_EventDetailAPIView(logged_in_user) -> None:  # type: ignore[no-untyped-def]
    client = APIClient()
    created_by_user, token = logged_in_user.values()

    new_event = EventFactory.create(created_by=created_by_user)
    assert Event.objects.filter(name=new_event.name).exists()

    # MARK: Detail GET

    response = client.get(f"{EVENTS_URL}{new_event.id}/")

    assert response.status_code == 200
    assert response.data["name"] == new_event.name

    # MARK: Detail PUT

    payload = {
        "name": "new_event",
        "start_time": "2020-09-18T21:39:14",
        "end_time": "2020-09-18T21:39:14",
        "terms_checked": True,
    }
    response = client.put(f"{EVENTS_URL}{new_event.id}/", data=payload, format="json")

    assert response.status_code == 401

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(f"{EVENTS_URL}{new_event.id}/", data=payload, format="json")

    assert response.status_code == 200
    assert payload["name"] == Event.objects.get(id=new_event.id).name

    # MARK: Detail DELETE

    client.credentials()
    response = client.delete(f"{EVENTS_URL}{new_event.id}/")
    assert response.status_code == 401

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(f"{EVENTS_URL}{new_event.id}/")

    assert response.status_code == 200
    assert not Event.objects.filter(id=new_event.id).exists()
