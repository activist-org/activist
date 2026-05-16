# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for updating organizations.
"""

from uuid import uuid4

import pytest
from django.test import Client

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db

ORGS_URL = "/v1/communities/organizations"


# MARK: Unauthenticated


def test_org_update_unauthenticated_401(client: Client) -> None:
    """
    Unauthenticated user receives 401 when trying to update an organization.

    Parameters
    ----------
    client : Client
        An unauthenticated Django test client.
    """
    org = OrganizationFactory()

    response = client.put(
        path=f"{ORGS_URL}/{org.id}",
        data={"orgName": "new_org", "name": "test_org"},
        content_type="application/json",
    )

    assert response.status_code == 401


# MARK: Non-Owner


def test_org_update_non_owner_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to update.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    org = OrganizationFactory()

    response = client.put(
        path=f"{ORGS_URL}/{org.id}",
        data={"orgName": "new_org", "name": "test_org"},
        content_type="application/json",
    )

    assert response.status_code == 403

    response_body = response.json()
    assert (
        response_body["detail"] == "You are not authorized to update this organization."
    )


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

    assert response.status_code == 404

    response_body = response.json()
    assert response_body["detail"] == "Organization not found."


# MARK: Owner


def test_org_update_owner_200(authenticated_client) -> None:
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

    assert response.status_code == 200

    response_body = response.json()
    assert response_body["name"] == "updated_org_name"
