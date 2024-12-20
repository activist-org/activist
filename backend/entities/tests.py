"""
Testing for the entities app.
"""

# mypy: ignore-errors
import pytest

from .factories import (
    OrganizationFactory,
    OrganizationEventFactory,
    OrganizationMemberFactory,
    OrganizationResourceFactory,
    GroupFactory,
    OrganizationTaskFactory,
    OrganizationTopicFactory,
    GroupEventFactory,
    GroupMemberFactory,
    GroupResourceFactory,
    GroupTopicFactory,
)

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    """Test the __str__ methods of the entities."""
    organization = OrganizationFactory.create()
    # Note: Needs to be updated to reflect the recent changes.
    # organization_application = OrganizationApplicationFactory.create()
    organization_event = OrganizationEventFactory.create()
    organization_member = OrganizationMemberFactory.create()
    organization_resource = OrganizationResourceFactory.create()
    organization_task = OrganizationTaskFactory.create()
    organization_topic = OrganizationTopicFactory.create()

    group = GroupFactory.create()
    group_event = GroupEventFactory.create()
    group_member = GroupMemberFactory.create()
    group_resource = GroupResourceFactory.create()
    group_topic = GroupTopicFactory.create()

    assert str(organization) == organization.name
    # assert str(organization_application) == str(organization_application.creation_date)
    assert str(organization_event) == str(organization_event.id)
    assert str(organization_member) == str(organization_member.id)
    assert str(organization_resource) == str(organization_resource.id)
    assert str(organization_task) == str(organization_task.id)
    assert str(organization_topic) == str(organization_topic.id)

    assert str(group) == group.name
    assert str(group_event) == str(group_event.id)
    assert str(group_member) == str(group_member.id)
    assert str(group_resource) == str(group_resource.id)
    assert str(group_topic) == str(group_topic.id)
