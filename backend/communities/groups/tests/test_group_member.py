# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupMember model.
"""

import pytest

from authentication.factories import UserFactory
from communities.factories import GroupFactory, GroupMemberFactory

pytestmark = pytest.mark.django_db


def test_group_member_str() -> None:
    """Test string representation of GroupMember model."""
    group_member = GroupMemberFactory.build()
    assert str(group_member) == f"{group_member.id}"


def test_group_member_roles() -> None:
    """Test the different roles a group member can have."""
    user = UserFactory()
    group = GroupFactory()

    print(group.__dict__)

    # 1. Test owner role.
    owner = GroupMemberFactory(
        group=group, user=user, is_owner=True, is_admin=False, is_comms=False
    )
    assert owner.is_owner is True
    assert owner.is_admin is False
    assert owner.is_comms is False

    # 2. Test admin role.
    admin = GroupMemberFactory(
        group=group, user=user, is_owner=False, is_admin=True, is_comms=False
    )
    assert admin.is_owner is False
    assert admin.is_admin is True
    assert admin.is_comms is False

    # 3. Test comms role.
    comms = GroupMemberFactory(
        group=group, user=user, is_owner=False, is_admin=False, is_comms=True
    )
    assert comms.is_owner is False
    assert comms.is_admin is False
    assert comms.is_comms is True


def test_multiple_members_per_group() -> None:
    """Test multiple members in a single group."""
    group = GroupFactory()
    members = [GroupMemberFactory(group=group) for _ in range(3)]

    assert len(members) == 3

    for member in members:
        assert member.group == group
