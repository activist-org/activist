# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test community permissions.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from communities import permissions

requires_drf = pytest.mark.skipif(
    not hasattr(permissions, "HasOrgPermission"),
    reason="djangorestframework not installed",
)


def test_get_org_membership_returns_none_for_unauthenticated_user(org, anon_user):
    assert permissions.get_org_membership(anon_user, org) is None


def test_get_org_membership_returns_none_for_none_user(org):
    assert permissions.get_org_membership(None, org) is None


def test_get_org_membership_returns_none_when_no_membership_exists(org, make_user):
    user = make_user("stranger")
    assert permissions.get_org_membership(user, org) is None


def test_get_org_membership_returns_the_membership(org, role, make_org_member):
    membership = make_org_member(org, role.MEMBER)
    assert permissions.get_org_membership(membership.user, org) is membership


def test_get_org_membership_is_scoped_to_the_given_org(role, make_org_member, make_org):
    org_a = make_org("A")
    org_b = make_org("B")
    membership = make_org_member(org_a, role.MEMBER)
    assert permissions.get_org_membership(membership.user, org_b) is None


def test_get_group_membership_returns_none_for_unauthenticated_user(group, anon_user):
    assert permissions.get_group_membership(anon_user, group) is None


def test_get_group_membership_returns_none_when_no_membership_exists(group, make_user):
    user = make_user("stranger")
    assert permissions.get_group_membership(user, group) is None


def test_get_group_membership_returns_the_membership(group, role, make_group_member):
    membership = make_group_member(group, role.MEMBER)
    assert permissions.get_group_membership(membership.user, group) is membership


def test_has_minimum_org_role_true_for_site_admin_with_no_membership(
    org, site_admin, role
):
    assert permissions.has_minimum_org_role(site_admin, org, role.ADMIN) is True


def test_has_minimum_org_role_false_when_no_membership(org, role, make_user):
    user = make_user("stranger")
    assert permissions.has_minimum_org_role(user, org, role.UNAUTHENTICATED) is False


def test_has_minimum_org_role_true_when_role_meets_requirement(
    org, role, make_org_member
):
    membership = make_org_member(org, role.COORDINATOR)
    assert permissions.has_minimum_org_role(membership.user, org, role.MEMBER) is True


def test_has_minimum_org_role_true_when_role_exactly_matches_requirement(
    org, role, make_org_member
):
    membership = make_org_member(org, role.MEMBER)
    assert permissions.has_minimum_org_role(membership.user, org, role.MEMBER) is True


def test_has_minimum_org_role_false_when_role_below_requirement(
    org, role, make_org_member
):
    membership = make_org_member(org, role.UNAUTHENTICATED)
    assert permissions.has_minimum_org_role(membership.user, org, role.MEMBER) is False


def test_has_minimum_group_role_true_for_site_admin(group, site_admin, role):
    assert permissions.has_minimum_group_role(site_admin, group, role.ADMIN) is True


def test_has_minimum_group_role_true_for_org_admin_without_group_membership(
    group, role, make_org_member
):
    org_admin_membership = make_org_member(group.org, role.ADMIN)
    assert (
        permissions.has_minimum_group_role(org_admin_membership.user, group, role.ADMIN)
        is True
    )


def test_has_minimum_group_role_true_when_group_role_meets_requirement(
    group, role, make_group_member
):
    membership = make_group_member(group, role.COORDINATOR)
    assert (
        permissions.has_minimum_group_role(membership.user, group, role.MEMBER) is True
    )


def test_has_minimum_group_role_false_when_group_role_below_requirement(
    group, role, make_group_member
):
    membership = make_group_member(group, role.UNAUTHENTICATED)
    assert (
        permissions.has_minimum_group_role(membership.user, group, role.MEMBER) is False
    )


def test_has_minimum_group_role_false_when_no_membership_at_all(group, role, make_user):
    user = make_user("stranger")
    assert (
        permissions.has_minimum_group_role(user, group, role.UNAUTHENTICATED) is False
    )


@pytest.mark.parametrize(
    "action, sufficient_role, insufficient_role",
    [
        ("view_org", "UNAUTHENTICATED", None),
        ("post_org_update", "MEMBER", "UNAUTHENTICATED"),
        ("invite_org_member", "COORDINATOR", "MEMBER"),
        ("remove_org_member", "ADMIN", "COORDINATOR"),
        ("delete_org", "ADMIN", "COORDINATOR"),
    ],
)
def test_has_org_permission_matches_action_requirements(
    org, role, action, sufficient_role, insufficient_role, make_org_member
):
    sufficient_member = make_org_member(
        org, getattr(role, sufficient_role), username="sufficient"
    )
    assert permissions.has_org_permission(sufficient_member.user, org, action) is True

    if insufficient_role is not None:
        insufficient_member = make_org_member(
            org, getattr(role, insufficient_role), username="insufficient"
        )
        assert (
            permissions.has_org_permission(insufficient_member.user, org, action)
            is False
        )


def test_has_org_permission_unknown_action_raises_key_error(org, role, make_org_member):
    member = make_org_member(org, role.ADMIN)
    with pytest.raises(KeyError):
        permissions.has_org_permission(member.user, org, "not_a_real_action")


@pytest.mark.parametrize(
    "action, sufficient_role, insufficient_role",
    [
        ("view_group", "UNAUTHENTICATED", None),
        ("post_group_update", "MEMBER", "UNAUTHENTICATED"),
        ("invite_group_member", "COORDINATOR", "MEMBER"),
        ("remove_group_member", "ADMIN", "COORDINATOR"),
        ("delete_group", "ADMIN", "COORDINATOR"),
    ],
)
def test_has_group_permission_matches_action_requirements(
    group, role, action, sufficient_role, insufficient_role, make_group_member
):
    sufficient_member = make_group_member(
        group, getattr(role, sufficient_role), username="sufficient"
    )
    assert (
        permissions.has_group_permission(sufficient_member.user, group, action) is True
    )

    if insufficient_role is not None:
        insufficient_member = make_group_member(
            group, getattr(role, insufficient_role), username="insufficient"
        )
        assert (
            permissions.has_group_permission(insufficient_member.user, group, action)
            is False
        )


def test_has_group_permission_unknown_action_raises_key_error(
    group, role, make_group_member
):
    member = make_group_member(group, role.ADMIN)
    with pytest.raises(KeyError):
        permissions.has_group_permission(member.user, group, "not_a_real_action")


def _make_view(action, action_permission_map, org=None, group=None):
    view = MagicMock()
    view.action = action
    view.action_permission_map = action_permission_map
    view.get_organization.return_value = org
    view.get_group.return_value = group
    return view


@requires_drf
def test_has_org_permission_class_allows_when_action_not_in_map(
    org, role, make_org_member
):
    unauthenticated_user = make_org_member(org, role.UNAUTHENTICATED).user
    view = _make_view(action="list", action_permission_map={}, org=org)
    request = MagicMock(user=unauthenticated_user)

    checker = permissions.HasOrgPermission()
    assert checker.has_permission(request, view) is True
    view.get_organization.assert_not_called()


@requires_drf
def test_has_org_permission_class_delegates_for_mapped_action(
    org, role, make_org_member
):
    member = make_org_member(org, role.ADMIN)
    view = _make_view(
        action="destroy",
        action_permission_map={"destroy": "delete_org"},
        org=org,
    )
    request = MagicMock(user=member.user)

    checker = permissions.HasOrgPermission()
    assert checker.has_permission(request, view) is True

    insufficient = make_org_member(
        org, role.UNAUTHENTICATED, username="unauthenticated_user"
    )
    request2 = MagicMock(user=insufficient.user)
    assert checker.has_permission(request2, view) is False
