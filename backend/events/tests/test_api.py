# SPDX-License-Identifier: AGPL-3.0-or-later
from typing import Any, TypedDict

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import OrganizationFactory
from events.factories import EventFactory
from events.models import Event


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
def test_EventListAPIView(logged_in_user) -> None:  # type: ignore[no-untyped-def]
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
    org = OrganizationFactory.create(org_name="test_org")
    token = logged_in_user["token"]

    payload = {
        "name": "test_event",
        "orgs_id": org.id,
        "type": "test",
        "start_time": "2020-09-18T21:39:14",
        "end_time": "2020-09-18T21:39:14",
        "terms_checked": True,
    }

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(EVENTS_URL, data=payload, format="json")

    assert response.status_code == 201
    assert Event.objects.filter(name=payload["name"]).exists()
    # ----------------------------------


@pytest.mark.django_db
def test_EventDetailAPIView(logged_in_user) -> None:  # type: ignore[no-untyped-def]
    EVENTS_URL = "/v1/events/events"
    client = APIClient()
    created_by_user, token = logged_in_user.values()

    test_event = EventFactory.create(created_by=created_by_user)
    assert Event.objects.filter(name=test_event.name).exists()

    # ------- Test get() method -------
    response = client.get(f"{EVENTS_URL}/{test_event.id}/")

    assert response.status_code == 200
    assert response.data["name"] == test_event.name
    # ---------------------------------

    # ------- Test put() method -------
    # -- 401
    payload = {
        "name": "test_event",
        "start_time": "2020-09-18T21:39:14",
        "end_time": "2020-09-18T21:39:14",
        "terms_checked": True,
    }
    response = client.put(f"{EVENTS_URL}/{test_event.id}/", data=payload, format="json")

    assert response.status_code == 401

    # -- 200
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(f"{EVENTS_URL}/{test_event.id}/", data=payload, format="json")

    assert response.status_code == 200
    assert payload["name"] == Event.objects.get(id=test_event.id).name
    # ---------------------------------

    # ------- Test delete() method -------
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(f"{EVENTS_URL}/{test_event.id}/")

    assert response.status_code == 200
    assert not Event.objects.filter(id=test_event.id).exists()
    # ------------------------------------
