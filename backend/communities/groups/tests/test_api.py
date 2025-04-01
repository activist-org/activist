# SPDX-License-Identifier: AGPL-3.0-or-later
from pathlib import Path
from typing import TypedDict

import pytest
from django.conf import settings
from django.core.management import call_command
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.groups.factories import GroupFactory
from communities.groups.models import Group
from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization
from content.factories import EntityLocationFactory


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


@pytest.fixture(scope="session")
def status_types(django_db_setup, django_db_blocker) -> None:
    """
    Load the status_types fixture into the test database.
    """
    with django_db_blocker.unblock():
        fixture_path = Path(settings.BASE_DIR) / "fixtures" / "status_types.json"
        call_command("loaddata", str(fixture_path), verbosity=2)


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
def test_GroupListAPIView(logged_in_user, status_types):
    # create a bunch of groups using group factories
    """
    # GET request
    call the api
    check response
    check data in response
    do the # of groups match the page size
    pagination keys?
    check pagination links

    # POST request
    call the api
    check response
    check data in response
    does the payload match the given data
    assert that the returned response is expected
    """

    client = APIClient()
    number_of_groups = 10

    OrganizationFactory.create_batch(number_of_groups)
    assert Organization.objects.count() == number_of_groups

    response = client.get("/v1/communities/groups/")
    assert response.status_code == 200

    newGroup = GroupFactory.build(group_name="new_group", terms_checked=True)
    location = EntityLocationFactory.build()

    payload = {
        "location": {
            "id": location.id,
            "lat": location.lat,
            "lon": location.lon,
            "bbox": location.bbox,
            "display_name": location.display_name,
        },
        "groupName": newGroup.group_name,
        "name": newGroup.name,
        "category": newGroup.category,
    }

    token = logged_in_user["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post("/v1/communities/groups/", data=payload, format="json")
    assert response.status_code == 201
    assert Group.objects.filter(group_name=newGroup.group_name).exists()
