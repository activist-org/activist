# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationResource model.
"""

import pytest

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)

pytestmark = pytest.mark.django_db


def test_org_resource_multiple_resources() -> None:
    """
    Test multiple resources for a single organization.
    """
    org = OrganizationFactory()
    org_resources = [OrganizationResourceFactory(org=org) for _ in range(3)]

    org.resources.set(org_resources)

    assert len(org_resources) == 3

    for resource in org_resources:
        assert resource in org.resources.all()
