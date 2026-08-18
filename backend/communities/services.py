# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Service functions for organization/group membership and role changes.

Keep signup/invite assignment and role-change logic here rather than in
views, so the rules are enforced identically no matter which endpoint
(web form, API, admin action) triggers them.
"""

from __future__ import annotations

from django.core.exceptions import PermissionDenied, ValidationError

from authentication import enums
from authentication.models import UserModel
from communities.groups.models import Group, GroupMember
from communities.organizations.models import Organization, OrganizationMember
from communities.permissions import get_group_membership, get_org_membership

# --- Joining ------------------------------------------------------------


def join_organization(
    user: UserModel, org: Organization, role: str = enums.MembershipRole.GUEST
) -> OrganizationMember:
    membership, _created = OrganizationMember.objects.get_or_create(
        org=org, user=user, defaults={"role": role}
    )
    return membership


def join_group(
    user: UserModel, group: Group, role: str = enums.MembershipRole.GUEST
) -> GroupMember:
    """
    Design decision: a user must already be a member of the Group's
    parent Organization before joining one of its Groups. Remove this
    check if you'd rather allow Group membership independent of Org
    membership.
    """
    if get_org_membership(user, group.org) is None:
        raise ValidationError(
            "User must be a member of the parent organization before "
            "joining a group within it."
        )
    membership, _created = GroupMember.objects.get_or_create(
        group=group, user=user, defaults={"role": role}
    )
    return membership


# --- Role changes ---------------------------------------------------------


def change_org_role(
    actor, membership: OrganizationMember, new_role: str
) -> OrganizationMember:
    """Change a user's role within an Organization, enforcing guardrails."""
    org = membership.org

    if not getattr(actor, "is_admin", False):
        actor_membership = get_org_membership(actor, org)
        if (
            actor_membership is None
            or actor_membership.role != enums.MembershipRole.ADMIN
        ):
            raise PermissionDenied(
                "Only an org admin or site admin can change org roles."
            )

    if (
        membership.role == enums.MembershipRole.ADMIN
        and new_role != enums.MembershipRole.ADMIN
    ):
        remaining_admins = (
            OrganizationMember.objects.filter(org=org, role=enums.MembershipRole.ADMIN)
            .exclude(pk=membership.pk)
            .count()
        )
        if remaining_admins == 0:
            raise ValidationError(
                "Cannot demote the last remaining admin of this organization."
            )

    membership.role = new_role
    membership.save(update_fields=["role"])
    return membership


def change_group_role(actor, membership: GroupMember, new_role: str) -> GroupMember:
    """
    Change a user's role within a Group. Site admins and admins of the
    group's parent Organization can do this outright (cascading power
    from Step: org admins control everything inside their org);
    otherwise the actor must be a group admin themselves.
    """
    group = membership.group

    is_site_admin = getattr(actor, "is_admin", False)
    is_org_admin = OrganizationMember.objects.filter(
        org=group.org, user=actor, role=enums.MembershipRole.ADMIN
    ).exists()

    if not (is_site_admin or is_org_admin):
        actor_membership = get_group_membership(actor, group)
        if (
            actor_membership is None
            or actor_membership.role != enums.MembershipRole.ADMIN
        ):
            raise PermissionDenied(
                "Only a group admin, org admin, or site admin can change group roles."
            )

    if (
        membership.role == enums.MembershipRole.ADMIN
        and new_role != enums.MembershipRole.ADMIN
    ):
        remaining_admins = (
            GroupMember.objects.filter(group=group, role=enums.MembershipRole.ADMIN)
            .exclude(pk=membership.pk)
            .count()
        )
        if remaining_admins == 0:
            raise ValidationError(
                "Cannot demote the last remaining admin of this group."
            )

    membership.role = new_role
    membership.save(update_fields=["role"])
    return membership
