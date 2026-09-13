# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for deleting organizations.
"""

from uuid import uuid4

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db

ORGS_URL = "/v1/communities/organizations"


# MARK: Unauthenticated


def test_org_delete_unauthorized_401() -> None:
    """
    Unauthenticated user receives 401 when trying to delete an organization.
    """
    client = APIClient()
    org = OrganizationFactory()
    original_values = (org.status_id, org.deletion_date)

    response = client.delete(
        path=f"{ORGS_URL}/{org.id}",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data["detail"] == "Authentication credentials were not provided."
    org.refresh_from_db()
    assert (org.status_id, org.deletion_date) == original_values


# MARK: Non-Owner


def test_org_delete_forbidden_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to delete.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    org = OrganizationFactory()
    original_values = (org.status_id, org.deletion_date)

    response = client.delete(
        path=f"{ORGS_URL}/{org.id}",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN

    response_body = response.json()
    assert (
        response_body["detail"] == "You are not authorized to delete this organization."
    )
    org.refresh_from_db()
    assert (org.status_id, org.deletion_date) == original_values


# MARK: Not Found


def test_org_delete_not_found_404(authenticated_client) -> None:
    """
    Authenticated user receives 404 when trying to delete a non-existent organization.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    invalid_org_id = uuid4()

    response = client.delete(
        path=f"{ORGS_URL}/{invalid_org_id}",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND

    response_body = response.json()
    assert response_body["detail"] == "Organization not found."
