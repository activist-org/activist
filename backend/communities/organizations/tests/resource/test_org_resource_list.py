# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)

pytestmark = pytest.mark.django_db


def test_org_resource_list():
    """
    Test to list all organization resources.
    """
    client = APIClient()

    user = UserFactory()
    org = OrganizationFactory(created_by=user)

    # Create multiple resources
    OrganizationResourceFactory.create_batch(3, org=org, created_by=user)

    response = client.get(path="/v1/communities/organization_resources")

    assert response.status_code == 200
    response_body = response.json()
    assert len(response_body) >= 3


def test_org_resource_list_empty():
    """
    Test listing organization resources when none exist.
    """
    client = APIClient()

    response = client.get(path="/v1/communities/organization_resources")

    assert response.status_code == 200
    response_body = response.json()
    assert isinstance(response_body, dict)
    assert response_body["count"] == 0
    assert response_body["results"] == []
