# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Service functions for organization/group membership and role changes.
"""

from __future__ import annotations

from django.core.exceptions import PermissionDenied, ValidationError

from authentication import enums
from authentication.models import UserModel
from communities.organizations.models import Organization, OrganizationMember
from communities.permissions import get_org_membership

# MARK: Joining


def join_organization(
    user: UserModel, org: Organization, role: str = enums.MembershipRole.UNAUTHENTICATED
) -> OrganizationMember:
    """
    Assign a membership role to a user joining an organization.

    Note: The Unauthenticated role is assigned by default.

    Parameters
    ----------
    user : UserModel
        The user to assign membership to.

    org : Organization
        The organization the user is joining.

    role : str, optional
        Role to assign to the user within the organization. Defaults to
        enums.MembershipRole.UNAUTHENTICATED.

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


# MARK: Change Role


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
        If actor is neither a site admin nor an org admin of
        membership.org.

    ValidationError
        If the change would demote the last remaining admin of the
        organization.
    """
    org = membership.org

    if not getattr(actor, "is_admin", False):
        actor_membership = get_org_membership(user=actor, org=org)
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
