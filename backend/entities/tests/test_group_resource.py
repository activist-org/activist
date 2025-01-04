"""
Test cases for GroupResource model.
"""

import pytest

from entities.factories import GroupFactory, GroupResourceFactory
from entities.models import GroupResource

pytestmark = pytest.mark.django_db


def test_group_resource_str() -> None:
    """Test string representation of GroupResource model."""
    group_resource = GroupResourceFactory.build()
    assert str(group_resource) == f"{group_resource.id}"


def test_group_resource_creation() -> None:
    """Test creating a GroupResource instance."""
    group = GroupFactory()
    resource = GroupResourceFactory(group=group)

    assert isinstance(resource, GroupResource)
    assert resource.group == group


def test_multiple_resources_per_group() -> None:
    """Test multiple resources for a single group."""
    group = GroupFactory()
    resources = [GroupResourceFactory(group=group) for _ in range(3)]

    assert len(resources) == 3
    for resource in resources:
        assert resource.group == group


def test_group_resource_deletion() -> None:
    """Test cascade deletion when group is deleted."""
    group = GroupFactory()
    resource = GroupResourceFactory(group=group)

    # Store resource ID for later verification.
    resource = resource.id

    # Delete the group.
    group.delete()

    # Verify resource is also deleted.
    assert not GroupResource.objects.filter(id=resource).exists()
