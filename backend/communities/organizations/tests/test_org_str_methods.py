# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test organization model str.
"""

import datetime

import pytest

from communities.factories import StatusTypeFactory
from communities.organizations.factories import (
    OrganizationApplicationStatusFactory,
    OrganizationFactory,
    OrganizationImageFactory,
    OrganizationMemberFactory,
    OrganizationTaskFactory,
    OrganizationTextFactory,
)
from communities.organizations.models import OrganizationApplication

pytestmark = pytest.mark.django_db


def test_org_str_methods_application() -> None:
    """
    Test string representation of OrganizationApplication model.
    """
    org = OrganizationFactory.build()
    status = StatusTypeFactory()

    # OrganizationApplication instead of OrganizationApplicationFactory (many-to-many field assignment issues).
    org_application = OrganizationApplication(
        org=org,
        status=status,
        creation_date=datetime.datetime.now(tz=datetime.timezone.utc),
    )

    assert str(org_application) == f"{org_application.creation_date}"

    assert str(org_application) == f"{org_application.creation_date}"


def test_org_str_methods_application_status() -> None:
    """
    Test string representation of OrganizationApplicationStatus model.
    """
    status = OrganizationApplicationStatusFactory.build(status_name="Approved")
    assert str(status) == "Approved"


def test_org_str_methods_image_str() -> None:
    """
    Test string representation of OrganizationImage model.
    """
    org_image = OrganizationImageFactory.build()
    assert str(org_image) == f"{org_image.id}"


def test_org_str_methods_text() -> None:
    """
    Test string representation of OrganizationText model.
    """
    org_text = OrganizationTextFactory.build(iso="en")
    org = org_text.org
    assert str(org_text) == f"{org} - en"


def test_org_str_methods() -> None:
    """
    Test the __str__ methods of the communities.
    """
    organization = OrganizationFactory.create()
    # Note: Needs to be updated to reflect the recent changes.
    # organization_application = OrganizationApplicationFactory.create()
    organization_member = OrganizationMemberFactory.create()
    organization_task = OrganizationTaskFactory.create()

    assert str(organization) == organization.name
    assert str(organization_member) == str(organization_member.id)
    assert str(organization_task) == str(organization_task.id)
