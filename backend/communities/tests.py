# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the communities app.
"""

# mypy: ignore-errors
import pytest

from communities.groups.factories import GroupFactory, GroupMemberFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationMemberFactory,
    OrganizationTaskFactory,
)
from communities.models import Status, StatusType
from authentication.factories import UserFactory


pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    """
    Test the __str__ methods of the communities.
    """
    organization = OrganizationFactory.create()
    # Note: Needs to be updated to reflect the recent changes.
    # organization_application = OrganizationApplicationFactory.create()
    organization_member = OrganizationMemberFactory.create()
    organization_task = OrganizationTaskFactory.create()

    group = GroupFactory.create()
    group_member = GroupMemberFactory.create()

    assert str(organization) == organization.name
    # assert str(organization_application) == str(organization_application.creation_date)
    assert str(organization_member) == str(organization_member.id)
    assert str(organization_task) == str(organization_task.id)

    assert str(group) == group.name
    assert str(group_member) == str(group_member.id)

def test_status_and_status_type_str_methods() -> None:
    """
    Test the __str__ methods of the Status and StatusType models.
    """

    status_type = StatusType.objects.create(name="Active")

    # Create an organization to use with Status.
    organization = OrganizationFactory.create()

    # Create a user for the Status.
    user = UserFactory.create()

    status = Status.objects.create(
        status_type=status_type,
        org=organization,
        user=user
    )

    assert str(status_type) == "Active"
    assert str(status) == f"{organization.name} - {status_type}"
