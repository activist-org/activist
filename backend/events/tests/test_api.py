# SPDX-License-Identifier: AGPL-3.0-or-later
from pathlib import Path
from typing import TypedDict

import pytest
from django.conf import settings
from django.core.management import call_command
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from content.factories import EntityLocationFactory
from events.models import Event
from events.factories import EventFactory


class UserDict(TypedDict):
    user: UserModel
    plaintext_password: str


def create_user(password: str) -> UserDict:
    """
    Create a user and return the user and password.
    """
    user = UserFactory.create(plaintext_password=password, is_confirmed=True)
    return {"user": user, "plaintext_password": password}


def login_user(user_data: UserDict) -> dict:
    """
    Log in a user and return the user and token.
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
def new_user() -> UserDict:
    return create_user("Activist@123!?")


@pytest.fixture
def created_by_user() -> UserModel:
    """
    Create a user and return the user object.
    """
    return create_user("Creator@123!?")["user"]


@pytest.fixture
def logged_in_user(new_user) -> dict:
    """
    Create a user and log in the user.
    """
    return login_user(new_user)


@pytest.fixture
def logged_in_created_by_user(created_by_user) -> dict:
    return login_user({"user": created_by_user, "plaintext_password": "Creator@123!?"})


@pytest.mark.django_db
def test_EventListAPIView(logged_in_user) -> None:
    EVENTS_URL = "/v1/events/events/"
    client = APIClient()
    number_of_events = 10
    page_size = 1

    # ------- Test get() method -------
    EventFactory.create_batch(number_of_events)
    assert Event.objects.count() == number_of_events

    response = client.get(f"{EVENTS_URL}?pageSize={page_size}")
    assert response.status_code == 200

    pagination_key = ["count", "next", "previous", "results"]
    assert all(key in response.data for key in pagination_key)
    assert len(response.data["results"]) == page_size
    # ---------------------------------

    # ------- Test post() method -------
    test_event = EventFactory.build(name="test_event", terms_checked=True)
    location = EntityLocationFactory.build()
    token = logged_in_user["token"]

    payload = {
        "name": test_event.name,
        "orgs": test_event.orgs,
        "offline_location": {
            "lat": location.lat,
            "lon": location.lon,
            "bbox": location.bbox,
            "display_name": location.display_name
        }
    }

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(EVENTS_URL, data=payload, format="json")

    assert response.status_code == 201
    assert Event.objects.filter(name=test_event.name).exists()
    # ----------------------------------


@pytest.mark.django_db
def test_EventDetailAPIView(logged_in_user, logged_in_created_by_user) -> None:
    EVENTS_URL = "/v1/events/events"
    client = APIClient()
    created_by_user, token_created_by = logged_in_created_by_user.values()

    test_event = EventFactory.create(created_by=created_by_user)
    assert Event.objects.filter(name=test_event.name).exists()

    # ------- Test get() method -------
    response = client.get(f"{EVENTS_URL}/{test_event.id}/")

    assert response.status_code == 200
    assert response.data["name"] == test_event.name
    # ---------------------------------

    # ------- Test put() method -------
    # -- 401
    payload = {"name": "test_event"}
    response = client.put(f"{EVENTS_URL}/{test_event.id}", data=payload, format="json")

    assert response.status_code == 401

    # -- 200
    client.credentials(HTTP_AUTHORIZATION=f"Token {token_created_by}")
    response = client.put(f"{EVENTS_URL}/{test_event.id}", data=payload, format="json")

    assert response.status_code == 200
    assert payload["name"] == Event.objects.get(id=test_event.id).name
    # ---------------------------------

    # ------- Test delete() method -------
    client.credentials(HTTP_AUTHORIZATION=f"Token {token_created_by}")
    response = client.delete(f"{EVENTS_URL}/{test_event.id}")

    assert response.status_code == 200
    assert not Event.objects.filter(id=test_event.id).exists()
    # ------------------------------------
