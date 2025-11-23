# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)

pytestmark = pytest.mark.django_db


def test_org_resource_retrieve_200():
    """
    Test retrieving a specific organization resource.
    """
    client = APIClient()

    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    resource = OrganizationResourceFactory(created_by=user, org=org)

    response = client.get(path=f"/v1/communities/organization_resources/{resource.id}")

    assert response.status_code == 200
    response_body = response.json()
    assert response_body["id"] == str(resource.id)
    assert response_body["name"] == resource.name
    assert response_body["description"] == resource.description


def test_org_resource_retrieve_404():
    """
    Test retrieving a non-existent organization resource returns 404.
    """
    client = APIClient()

    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.get(path=f"/v1/communities/organization_resources/{fake_uuid}")

    assert response.status_code == 404
