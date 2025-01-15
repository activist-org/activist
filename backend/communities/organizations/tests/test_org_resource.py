# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationResource model.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from content.factories import ResourceFactory
from content.models import Resource

pytestmark = pytest.mark.django_db


def test_org_resource_creation() -> None:
    """Test creating a OrganizationResource instance."""
    org = OrganizationFactory()
    resource = ResourceFactory()

    org.resources.set([resource])

    assert isinstance(org.resources.first(), Resource)
    assert org.resources.first() == resource


def test_multiple_resources_per_org() -> None:
    """Test multiple resources for a single organization."""
    org = OrganizationFactory()
    resources = ResourceFactory.create_batch(3)

    org.resources.set(resources)

    assert len(resources) == 3

    for resource in resources:
        assert resource in org.resources.all()
