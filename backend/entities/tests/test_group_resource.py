"""
Test cases for GroupResource model.
"""

import pytest

from content.factories import ResourceFactory
from content.models import Resource
from entities.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_resource_creation() -> None:
    """Test creating a GroupResource instance."""
    group = GroupFactory()
    resource = ResourceFactory()

    group.resources.set([resource])

    assert isinstance(group.resources.first(), Resource)
    assert group.resources.first() == resource


def test_multiple_resources_per_group() -> None:
    """Test multiple resources for a single group."""
    group = GroupFactory()
    resources = ResourceFactory.create_batch(3)

    group.resources.set(resources)

    assert len(resources) == 3

    for resource in resources:
        assert resource in group.resources.all()
