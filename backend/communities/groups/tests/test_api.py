# SPDX-License-Identifier: AGPL-3.0-or-later
from pathlib import Path

import pytest
from django.conf import settings
from django.core.management import call_command
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.groups.factories import GroupFactory
from communities.groups.models import Group
from content.factories import EntityLocationFactory


class UserAndPassword:
    def __init__(self, plaintext_password="Creator@!123?"):
        self.user = UserFactory.create(
            plaintext_password=plaintext_password, is_confirmed=True
        )
        self.password = plaintext_password


class UserLogin:
    def __init__(self, user: UserModel, token: str):
        self.user = user
        self.token = token


def create_user(password: str) -> dict:
    """
    Create a user and return the user and password.
    """
    user = UserFactory.create(plaintext_password=password, is_confirmed=True)
    return {"user": user, "plaintext_password": password}


def login_user(user_data: UserAndPassword) -> UserLogin:
    """
    Log in a user and return the user and token.
    """
    client = APIClient()
    response = client.post(
        "/v1/auth/sign_in/",
        {
            "username": user_data.user.username,
            "password": user_data.password,
        },
    )
    assert response.status_code == 200
    return UserLogin(user_data.user, response.data["token"])


@pytest.fixture(scope="session")
def status_types(django_db_setup, django_db_blocker) -> None:
    """
    Load the status_types fixture into the test database.
    """
    with django_db_blocker.unblock():
        fixture_path = Path(settings.BASE_DIR) / "fixtures" / "status_types.json"
        call_command("loaddata", str(fixture_path), verbosity=2)


@pytest.fixture
def new_user() -> UserAndPassword:
    return UserAndPassword("Activist@123!?")


@pytest.fixture
def created_by_user() -> UserAndPassword:
    """
    Create a user and return the user object.
    """
    return UserAndPassword()


@pytest.fixture
def logged_in_user(new_user) -> UserLogin:
    """
    Create a user and log in the user.
    """
    return login_user(new_user)


@pytest.fixture
def logged_in_created_by_user(created_by_user) -> UserLogin:
    return login_user(created_by_user)


@pytest.mark.django_db
def test_GroupListAPIView(logged_in_user, status_types):
    """
    Test OrganizationAPIView

    # GET request

    1. Verify the number of groups in the database
    2. Test the list view endpoint
    3. Check if the pagination keys are present
    4. Test if query_param page_size is working properly
    5. Verify the number of groups in the response matches the page_size
    6. Check the pagination links in the response

    # POST request

    1. Create a new organization with a valid payload
    2. Verify the response status code is 201 (Created)
    """

    client = APIClient()
    number_of_groups = 10
    test_page_size = 1

    GroupFactory.create_batch(number_of_groups)
    assert Group.objects.count() == number_of_groups

    response = client.get("/v1/communities/groups/")
    assert response.status_code == 200

    pagination_keys = ["count", "next", "previous", "results"]
    assert all(key in response.data for key in pagination_keys)

    response = client.get(f"/v1/communities/groups/?pageSize={test_page_size}")
    assert response.status_code == 200

    assert len(response.data["results"]) == test_page_size
    assert response.data["previous"] is None
    assert response.data["next"] is not None

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

    token = logged_in_user.token

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post("/v1/communities/groups/", data=payload, format="json")
    assert response.status_code == 201
    assert Group.objects.filter(group_name=newGroup.group_name).exists()


@pytest.mark.django_db
def test_GroupDetailAPIView(logged_in_user, logged_in_created_by_user) -> None:
    """
    Test GroupDetailAPIView

    # GET request

    1. Create a new group and verify it exists in the database.
    2. Test the detail view endpoint for the group.
    3. Verify the response status code is 200 (OK).
    4. Ensure the response data matches the group data.

    # PUT request

    1. Check if groups can be edited without the proper credentials
    2. Update the group with the created_by user and verify the changes are saved.

    # DELETE request

    1. Check if groups can be deleted without the proper credentials
    2. Delete the group with the created_by user and verify it is removed from the database.
    """
    client = APIClient()
    created_by_user, token_created_by = (
        logged_in_created_by_user.user,
        logged_in_created_by_user.token,
    )

    newGroup = GroupFactory.create(created_by=created_by_user)
    assert Group.objects.filter(group_name=newGroup.group_name).exists()

    response = client.get(f"/v1/communities/groups/{newGroup.id}/")
    assert response.status_code == 200
    assert response.data["group_name"] == newGroup.group_name

    updated_payload = {"group_name": "updated_group_name"}
    response = client.put(
        f"/v1/communities/groups/{newGroup.id}/",
        data=updated_payload,
        format="json",
    )
    assert response.status_code == 401

    client.credentials(HTTP_AUTHORIZATION=f"Token {token_created_by}")
    response = client.put(
        f"/v1/communities/groups/{newGroup.id}/",
        data=updated_payload,
        format="json",
    )
    assert response.status_code == 200

    updated_group = Group.objects.get(id=newGroup.id)
    assert updated_group.group_name == "updated_group_name"

    client.credentials()
    response = client.delete(f"/v1/communities/groups/{newGroup.id}/")
    assert response.status_code == 401

    client.credentials(HTTP_AUTHORIZATION=f"Token {token_created_by}")
    response = client.delete(f"/v1/communities/groups/{newGroup.id}/")
    assert response.status_code == 200
