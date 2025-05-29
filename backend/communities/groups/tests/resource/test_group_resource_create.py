# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupResource model creation.
"""

import pytest

from communities.groups.factories import GroupFactory
from content.factories import ResourceFactory
from content.models import Resource

pytestmark = pytest.mark.django_db


def test_group_resource_create() -> None:
    """
    Test creating a GroupResource instance.
    """
    group = GroupFactory()
    resource = ResourceFactory()

    group.resources.set([resource])

    assert isinstance(group.resources.first(), Resource)
    assert group.resources.first() == resource
