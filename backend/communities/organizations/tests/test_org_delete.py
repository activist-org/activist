# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for deleting organizations.
"""

from uuid import uuid4

import pytest
from django.test import Client

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db

ORGS_URL = "/v1/communities/organizations"


# MARK: Unauthenticated


def test_org_delete_unauthenticated_401(client: Client) -> None:
    """
    Unauthenticated user receives 401 when trying to delete an organization.

    Parameters
    ----------
    client : Client
        An unauthenticated Django test client.
    """
    org = OrganizationFactory()

    response = client.delete(
        path=f"{ORGS_URL}/{org.id}",
    )

    assert response.status_code == 401


# MARK: Non-Owner


def test_org_delete_non_owner_403(authenticated_client) -> None:
    """
    Authenticated user who is not the owner receives 403 when trying to delete.

    Parameters
    ----------
    authenticated_client : tuple[APIClient, UserModel]
        An authenticated client with a test user.
    """
    client, user = authenticated_client

    org = OrganizationFactory()

    response = client.delete(
        path=f"{ORGS_URL}/{org.id}",
    )

    assert response.status_code == 403

    response_body = response.json()
    assert (
        response_body["detail"] == "You are not authorized to delete this organization."
    )


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

    bad_org_id = uuid4()

    response = client.delete(
        path=f"{ORGS_URL}/{bad_org_id}",
    )

    assert response.status_code == 404

    response_body = response.json()
    assert response_body["detail"] == "Organization not found."
