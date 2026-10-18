# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupMember model.
"""

import pytest

from communities.groups.factories import GroupFactory, GroupMemberFactory

pytestmark = pytest.mark.django_db


def test_group_member_str() -> None:
    """
    Test string representation of GroupMember model.
    """
    group_member = GroupMemberFactory.build()
    assert str(group_member) == f"{group_member.id}"


def test_group_member_multiple_members() -> None:
    """
    Test multiple members in a single group.
    """
    group = GroupFactory()
    members = [GroupMemberFactory(group=group) for _ in range(3)]

    assert len(members) == 3

    for member in members:
        assert member.group == group
