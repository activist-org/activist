"""
Test cases for the GroupMember model.
"""

import pytest

from authentication.factories import UserFactory
from entities.factories import GroupFactory, GroupMemberFactory

pytestmark = pytest.mark.django_db


def test_group_member_str() -> None:
    """Test string representation of GroupMember model"""
    group_member = GroupMemberFactory.build()
    assert str(group_member) == f"{group_member.id}"


def test_group_member_roles() -> None:
    """Test the different roles a group member can have"""
    user = UserFactory()
    group = GroupFactory()

    # Test owner role
    owner = GroupMemberFactory(
        group_id=group, user_id=user, is_owner=True, is_admin=False, is_comms=False
    )
    assert owner.is_owner is True
    assert owner.is_admin is False
    assert owner.is_comms is False

    # Test admin role
    admin = GroupMemberFactory(
        group_id=group, user_id=user, is_owner=False, is_admin=True, is_comms=False
    )
    assert admin.is_owner is False
    assert admin.is_admin is True
    assert admin.is_comms is False

    # Test comms role
    comms = GroupMemberFactory(
        group_id=group, user_id=user, is_owner=False, is_admin=False, is_comms=True
    )
    assert comms.is_owner is False
    assert comms.is_admin is False
    assert comms.is_comms is True


def test_multiple_members_per_group() -> None:
    """Test multiple members in a single group"""
    group = GroupFactory()
    members = [GroupMemberFactory(group_id=group) for _ in range(3)]

    assert len(members) == 3

    for member in members:
        assert member.group_id == group
