# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the communities app.
"""

# mypy: ignore-errors
import pytest

from communities.groups.factories import GroupFactory, GroupMemberFactory

pytestmark = pytest.mark.django_db


def test_org_str_methods() -> None:
    """
    Test the __str__ methods for groups.
    """
    group = GroupFactory.create()
    group_member = GroupMemberFactory.create()

    assert str(group) == group.name
    assert str(group_member) == str(group_member.id)
