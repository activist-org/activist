# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Service functions for organization/group membership and role changes.
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
    """
    Assign a membership role to a user joining an organization.

    Guest role is assigned by default.

    Parameters
    ----------
    user : UserModel
        The user to assign membership to.
    org : Organization
        The organization the user is joining.
    role : str, optional
        Role to assign to the user within the organization. Defaults to
        ``enums.MembershipRole.GUEST``.

    Returns
    -------
    OrganizationMember
        The existing membership if one already exists, otherwise the
        newly created membership record.
    """
    membership, _created = OrganizationMember.objects.get_or_create(
        org=org, user=user, defaults={"role": role}
    )
    return membership


def join_group(
    user: UserModel, group: Group, role: str = enums.MembershipRole.GUEST
) -> GroupMember:
    """
    Assign a membership role to a user joining a group.

    Design decision: a user must already be a member of the Group's
    parent Organization before joining one of its Groups. Remove this
    check if you'd rather allow Group membership independent of Org
    membership.

    Parameters
    ----------
    user : UserModel
        The user to assign membership to.
    group : Group
        The group the user is joining.
    role : str, optional
        Role to assign to the user within the group. Defaults to
        ``enums.MembershipRole.GUEST``.

    Returns
    -------
    GroupMember
        The existing membership if one already exists, otherwise the
        newly created membership record.

    Raises
    ------
    ValidationError
        If the user is not already a member of the group's parent
        organization.
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
    actor: UserModel, membership: OrganizationMember, new_role: str
) -> OrganizationMember:
    """
    Change a user's role within an Organization, enforcing guardrails.

    Parameters
    ----------
    actor : UserModel
        The user attempting to perform the role change.
    membership : OrganizationMember
        The organization membership whose role is being changed.
    new_role : str
        The role to assign to the membership.

    Returns
    -------
    OrganizationMember
        The updated membership record.

    Raises
    ------
    PermissionDenied
        If ``actor`` is neither a site admin nor an org admin of
        ``membership.org``.
    ValidationError
        If the change would demote the last remaining admin of the
        organization.
    """
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


def change_group_role(
    actor: UserModel, membership: GroupMember, new_role: str
) -> GroupMember:
    """
    Change a user's role within a Group.

    Site admins and admins of the group's parent Organization can do
    this outright (cascading power from Step: org admins control
    everything inside their org); otherwise the actor must be a group
    admin themselves.

    Parameters
    ----------
    actor : UserModel
        The user attempting to perform the role change.
    membership : GroupMember
        The group membership whose role is being changed.
    new_role : str
        The role to assign to the membership.

    Returns
    -------
    GroupMember
        The updated membership record.

    Raises
    ------
    PermissionDenied
        If ``actor`` is not a site admin, an org admin of the group's
        organization, or a group admin.
    ValidationError
        If the change would demote the last remaining admin of the
        group.
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
