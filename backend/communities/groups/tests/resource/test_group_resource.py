# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupResource model.
"""

import pytest

from communities.groups.factories import GroupFactory, GroupResourceFactory

pytestmark = pytest.mark.django_db


def test_group_resource_multiple_resources() -> None:
    """
    Test multiple resources for a single group.
    """
    group = GroupFactory()
    resources = [GroupResourceFactory(group=group) for _ in range(3)]

    group.resources.set(resources)

    assert len(resources) == 3

    for resource in resources:
        assert resource in group.resources.all()
