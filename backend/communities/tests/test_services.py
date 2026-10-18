# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test community services.
"""

from __future__ import annotations

import pytest
from django.core.exceptions import PermissionDenied, ValidationError

from communities import services


def test_join_organization_creates_membership_with_default_unauthenticated_role(
    org, role, make_user
):
    user = make_user("newbie")

    membership = services.join_organization(user, org)

    assert membership.org is org
    assert membership.user is user
    assert membership.role == role.UNAUTHENTICATED


def test_join_organization_honors_explicit_role(org, role, make_user):
    user = make_user("newbie")

    membership = services.join_organization(user, org, role=role.MEMBER)

    assert membership.role == role.MEMBER


def test_join_organization_is_idempotent(org, role, make_user):
    user = make_user("repeat-joiner")

    first = services.join_organization(user, org, role=role.MEMBER)
    second = services.join_organization(user, org, role=role.ADMIN)

    # get_or_create should return the existing row untouched, not upgrade it.
    assert first is second
    assert second.role == role.MEMBER


def test_change_org_role_site_admin_can_change_anyone(
    org, site_admin, role, make_org_member
):
    target = make_org_member(org, role.MEMBER)

    updated = services.change_org_role(site_admin, target, role.COORDINATOR)

    assert updated.role == role.COORDINATOR


def test_change_org_role_org_admin_can_change_member(org, role, make_org_member):
    admin = make_org_member(org, role.ADMIN, username="admin1")
    target = make_org_member(org, role.MEMBER, username="target")

    updated = services.change_org_role(admin.user, target, role.COORDINATOR)

    assert updated.role == role.COORDINATOR


def test_change_org_role_non_admin_actor_is_denied(org, role, make_org_member):
    actor = make_org_member(org, role.MEMBER, username="actor")
    target = make_org_member(org, role.MEMBER, username="target")

    with pytest.raises(PermissionDenied):
        services.change_org_role(actor.user, target, role.COORDINATOR)

    # Role must be unchanged after a denied attempt.
    assert target.role == role.MEMBER


def test_change_org_role_non_member_actor_is_denied(
    org, role, make_user, make_org_member
):
    actor = make_user("outsider")
    target = make_org_member(org, role.MEMBER)

    with pytest.raises(PermissionDenied):
        services.change_org_role(actor, target, role.COORDINATOR)


def test_change_org_role_cannot_demote_last_admin(org, role, make_org_member):
    only_admin = make_org_member(org, role.ADMIN)

    with pytest.raises(ValidationError):
        services.change_org_role(only_admin.user, only_admin, role.MEMBER)

    assert only_admin.role == role.ADMIN


def test_change_org_role_can_demote_admin_when_another_admin_remains(
    org, role, make_org_member
):
    admin_one = make_org_member(org, role.ADMIN, username="admin1")
    admin_two = make_org_member(org, role.ADMIN, username="admin2")

    updated = services.change_org_role(admin_one.user, admin_two, role.MEMBER)

    assert updated.role == role.MEMBER


def test_change_org_role_promoting_is_never_blocked_by_last_admin_check(
    org, role, make_org_member
):
    only_admin = make_org_member(org, role.ADMIN)

    updated = services.change_org_role(only_admin.user, only_admin, role.ADMIN)

    assert updated.role == role.ADMIN
