# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for updating organizations.
"""

from uuid import uuid4

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db

ORGS_URL = "/v1/communities/organizations"


# MARK: Unauthenticated


def test_org_update_unauthorized_401() -> None:
    """
    Unauthenticated user receives 401 when trying to update an organization.
    """
    client = APIClient()
    org = OrganizationFactory()
    original_name = org.name

    response = client.put(
        path=f"{ORGS_URL}/{org.id}",
        data={"name": "updated_org_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["detail"] == "Authentication credentials were not provided."
    org.refresh_from_db()
    assert org.name == original_name


# MARK: Non-Owner


def test_org_update_forbidden_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to update.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    org_owner = UserFactory()
    org = OrganizationFactory(created_by=org_owner)
    original_name = org.name

    response = client.put(
        path=f"{ORGS_URL}/{org.id}",
        data={"name": "updated_org_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN

    response_body = response.json()
    assert (
        response_body["detail"] == "You are not authorized to update this organization."
    )
    org.refresh_from_db()
    assert org.name == original_name


# MARK: Not Found


def test_org_update_not_found_404(authenticated_client) -> None:
    """
    Authenticated user receives 404 when trying to update a non-existent organization.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    bad_org_id = uuid4()

    response = client.put(
        path=f"{ORGS_URL}/{bad_org_id}",
        data={"orgName": "new_org", "name": "test_org"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

    response_body = response.json()
    assert response_body["detail"] == "Organization not found."


# MARK: Owner


def test_org_update_owner_ok_200(authenticated_client) -> None:
    """
    Owner of the organization can successfully update it.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)

    response = client.put(
        path=f"{ORGS_URL}/{org.id}",
        data={"name": "updated_org_name"},
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK

    response_body = response.json()
    assert response_body["name"] == "updated_org_name"
