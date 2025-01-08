"""
Testing for the communities app.
"""

# mypy: ignore-errors
import pytest

from .factories import (
    OrganizationFactory,
    OrganizationMemberFactory,
    GroupFactory,
    OrganizationTaskFactory,
    GroupMemberFactory,
)

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    """Test the __str__ methods of the communities."""
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
