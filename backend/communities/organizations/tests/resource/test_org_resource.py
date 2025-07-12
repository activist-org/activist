# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationResource model.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from content.factories import ResourceFactory

pytestmark = pytest.mark.django_db


def test_org_resource_multiple_resources() -> None:
    """
    Test multiple resources for a single organization.
    """
    org = OrganizationFactory()
    resources = ResourceFactory.create_batch(3)

    org.resources.set(resources)

    assert len(resources) == 3

    for resource in resources:
        assert resource in org.resources.all()
