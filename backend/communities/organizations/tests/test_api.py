# SPDX-License-Identifier: AGPL-3.0-or-later
from pathlib import Path
from typing import TypedDict

import pytest
from django.conf import settings
from django.core.management import call_command
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import Organization, OrganizationApplication
from content.factories import EntityLocationFactory


class UserDict(TypedDict):
    user: UserModel
    plaintext_password: str


def create_user(password: str) -> UserDict:
    """Create a user and return the user and password"""
    user = UserFactory.create(plaintext_password=password, is_confirmed=True)
    return {"user": user, "plaintext_password": password}


def login_user(user_data: UserDict) -> dict:
    """Log in a user and return the user and token"""
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
    """Load the status_types fixture into the test database"""
    with django_db_blocker.unblock():
        fixture_path = Path(settings.BASE_DIR) / "fixtures" / "status_types.json"
        call_command("loaddata", str(fixture_path), verbosity=2)


@pytest.fixture
def new_user() -> UserDict:
    return create_user("Activist@123!?")


@pytest.fixture
def created_by_user() -> UserModel:
    """Create a user and return the user object"""
    return create_user("Creator@123!?")["user"]


@pytest.fixture
def logged_in_user(new_user) -> dict:
    """Create a user and log in the user"""
    return login_user(new_user)


@pytest.fixture
def logged_in_created_by_user(created_by_user) -> dict:
    return login_user({"user": created_by_user, "plaintext_password": "Creator@123!?"})


@pytest.mark.django_db
def test_OrganizationAPIView(logged_in_user, status_types) -> None:
    """Test OrganizationAPIView

    # GET request

    1. Verify the number of organizations in the database
    2. Test the list view endpoint
    3. Check if the response contains the pagination keys
    4. Test if query_param page_size is working properly
    5. Verify the number of organizations in the response matches the page_size
    6. Check the pagination links in the response

    # POST request

    1. Create a new organization with a valid payload
    2. Verify the response status code is 201 (Created)
    """
    client = APIClient()
    test_page_size = 1
    number_of_orgs = 10

    OrganizationFactory.create_batch(number_of_orgs)
    assert Organization.objects.count() == number_of_orgs

    response = client.get("/v1/communities/organizations/")
    assert response.status_code == 200

    pagination_keys = ["count", "next", "previous", "results"]
    assert all(key in response.data for key in pagination_keys)

    response = client.get(f"/v1/communities/organizations/?pageSize={test_page_size}")
    assert response.status_code == 200

    assert len(response.data["results"]) == test_page_size
    assert response.data["previous"] is None
    assert response.data["next"] is not None

    new_org = OrganizationFactory.build(org_name="new_org", terms_checked=True)
    location = EntityLocationFactory.build()

    token = logged_in_user["token"]

    payload = {
        "location": {
            "lat": location.lat,
            "lon": location.lon,
            "bbox": location.bbox,
            "display_name": location.display_name,
        },
        "org_name": new_org.org_name,
        "name": new_org.name,
        "tagline": new_org.tagline,
        "get_involved_url": new_org.get_involved_url,
        "terms_checked": new_org.terms_checked,
        "is_high_risk": new_org.is_high_risk,
    }

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        "/v1/communities/organizations/", data=payload, format="json"
    )
    org = Organization.objects.get(org_name=new_org.org_name)
    print(org)
    assert response.status_code == 201
    assert Organization.objects.filter(org_name=new_org.org_name).exists()
    assert OrganizationApplication.objects.filter(
        org__org_name=new_org.org_name
    ).exists()


@pytest.mark.django_db
def test_organizationDetaiAPIView(logged_in_user, logged_in_created_by_user) -> None:
    """Test OrganizationDetailAPIView

    # GET request

    1. Create a new organization
    2. Verify the organization exists in the database
    3. Test the detail view endpoint
    4. Verify the response status code is 200 (OK)
    5. Verify the response data matches the organization data

    # DELETE request

    1. Try to delte the organization with a user that is not the created_by user
    2. Try to delete the organization with the created_by user
    """

    client = APIClient()
    created_by_user, token_created_by = logged_in_created_by_user.values()

    new_org = OrganizationFactory.create(created_by=created_by_user)
    assert Organization.objects.filter(org_name=new_org.org_name).exists()

    response = client.get(f"/v1/communities/organizations/{new_org.id}/")
    assert response.status_code == 200
    assert response.data["org_name"] == new_org.org_name

    token = logged_in_user["token"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(f"/v1/communities/organizations/{new_org.id}/")
    assert response.status_code == 401

    client.credentials(HTTP_AUTHORIZATION=f"Token {token_created_by}")
    response = client.delete(f"/v1/communities/organizations/{new_org.id}/")
    assert response.status_code == 200
