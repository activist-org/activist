# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationResource model.
"""

import pytest

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)
from content.models import Resource

pytestmark = pytest.mark.django_db


def test_org_resource_create() -> None:
    """
    Test creating a OrganizationResource instance.
    """
    org = OrganizationFactory()
    resource = OrganizationResourceFactory(org=org)

    org.resources.set([resource])

    assert isinstance(org.resources.first(), Resource)
    assert org.resources.first() == resource
