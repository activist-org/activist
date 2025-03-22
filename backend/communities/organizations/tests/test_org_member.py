# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the OrganizationMember model.
"""

import pytest

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationMemberFactory,
)

pytestmark = pytest.mark.django_db


def test_org_member_str() -> None:
    """
    Test string representation of OrganizationMember model.
    """
    org_member = OrganizationMemberFactory.build()
    assert str(org_member) == f"{org_member.id}"


def test_org_member_roles() -> None:
    """
    Test the different roles an organization member can have.
    """
    user = UserFactory()
    org = OrganizationFactory()

    print(org.__dict__)

    # 1. Test owner role.
    owner = OrganizationMemberFactory(
        org=org, user=user, is_owner=True, is_admin=False, is_comms=False
    )
    assert owner.is_owner is True
    assert owner.is_admin is False
    assert owner.is_comms is False

    # 2. Test admin role.
    admin = OrganizationMemberFactory(
        org=org, user=user, is_owner=False, is_admin=True, is_comms=False
    )
    assert admin.is_owner is False
    assert admin.is_admin is True
    assert admin.is_comms is False

    # 3. Test comms role.
    comms = OrganizationMemberFactory(
        org=org, user=user, is_owner=False, is_admin=False, is_comms=True
    )
    assert comms.is_owner is False
    assert comms.is_admin is False
    assert comms.is_comms is True


def test_multiple_members_per_org() -> None:
    """
    Test multiple members in a single organization.
    """
    org = OrganizationFactory()
    members = [OrganizationMemberFactory(org=org) for _ in range(3)]

    assert len(members) == 3

    for member in members:
        assert member.org == org
