# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)

pytestmark = pytest.mark.django_db


def test_org_resource_delete_200(authenticated_client):
    """
    Test successful deletion of an organization resource by the organization owner.
    """
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)
    resource = OrganizationResourceFactory(created_by=user, org=org)

    # Delete the resource as the owner.
    response = client.delete(
        path=f"/v1/communities/organization_resources/{resource.id}"
    )

    assert response.status_code == 204


def test_org_resource_delete_403(authenticated_client):
    """
    Test that non-owner cannot delete an organization resource.
    """
    client = APIClient()

    # Create owner user.
    owner_user = UserFactory(
        username="owner",
        plaintext_password="owner_pass",
        is_confirmed=True,
        verified=True,
    )

    # Create non-owner user.
    test_username = "test_user"
    test_password = "test_pass"
    UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
    )

    org = OrganizationFactory(created_by=owner_user)
    resource = OrganizationResourceFactory(created_by=owner_user, org=org)

    # Login as non-owner.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Try to delete the resource as non-owner.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(
        path=f"/v1/communities/organization_resources/{resource.id}"
    )

    assert response.status_code == 204


def test_org_resource_delete_404(authenticated_client):
    """
    Test deletion of non-existent organization resource returns 404.
    """
    client, _ = authenticated_client

    # Try to delete non-existent resource.
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.delete(path=f"/v1/communities/organization_resources/{fake_uuid}")

    assert response.status_code == 404


def test_org_resource_delete_staff_200():
    """
    Test that staff users can delete any organization resource.
    """
    client = APIClient()

    # Create owner user.
    owner_user = UserFactory(
        username="owner",
        plaintext_password="owner_pass",
        is_confirmed=True,
        verified=True,
    )

    # Create staff user.
    test_username = "staff_user"
    test_password = "staff_pass"
    UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
        is_staff=True,
    )

    org = OrganizationFactory(created_by=owner_user)
    resource = OrganizationResourceFactory(created_by=owner_user, org=org)

    # Login as staff.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Delete the resource as staff.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(
        path=f"/v1/communities/organization_resources/{resource.id}"
    )

    assert response.status_code == 204
