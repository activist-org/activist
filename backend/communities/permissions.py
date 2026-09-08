# SPDX-License-Identifier: AGPL-3.0-or-later
# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Permission checks and membership lookups for organizations and groups.

Also defines the DRF permission classes built on top of these checks.
"""

from __future__ import annotations

from typing import Any, Union
from uuid import UUID

from authentication import enums
from authentication.models import UserModel
from communities.groups.models import Group, GroupMember
from communities.organizations.models import Organization, OrganizationMember

AuthUser = Union[UserModel, UUID, None]


def get_org_membership(user: AuthUser, org: Organization) -> OrganizationMember | None:
    """
    Get a user's membership record in an organization.

    Parameters
    ----------
    user : AuthUser
        The user to look up. Unauthenticated users (or ``None``) always
        resolve to no membership.
    org : Organization
        The organization to check membership in.

    Returns
    -------
    OrganizationMember or None
        The user's membership record, or ``None`` if the user is not
        authenticated or has no membership in the organization.
    """
    if not getattr(user, "is_authenticated", False):
        return None
    return OrganizationMember.objects.filter(org=org, user=user).first()


def get_group_membership(user: AuthUser, group: Group) -> GroupMember | None:
    """
    Get a user's membership record in a group.

    Parameters
    ----------
    user : AuthUser
        The user to look up. Unauthenticated users (or ``None``) always
        resolve to no membership.
    group : Group
        The group to check membership in.

    Returns
    -------
    GroupMember or None
        The user's membership record, or ``None`` if the user is not
        authenticated or has no membership in the group.
    """
    if not getattr(user, "is_authenticated", False):
        return None
    return GroupMember.objects.filter(group=group, user=user).first()


def has_org_role_atleast(user: AuthUser, org: Organization, role: str) -> bool:
    """
    Return whether the user holds at least the given role in an organization.

    Site admins always satisfy this check, regardless of their role.

    Parameters
    ----------
    user : AuthUser
        The user to check.
    org : Organization
        The organization to check the role within.
    role : str
        The minimum role required.

    Returns
    -------
    bool
        True if the user is a site admin or their organization role
        meets or exceeds ``role``, False otherwise.
    """
    if getattr(user, "is_admin", False):
        return True
    membership = get_org_membership(user, org=org)
    if membership is None:
        return False
    return (
        membership.role_level
        >= enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(role)]
    )


def has_group_role_atleast(user: AuthUser, group: Group, role: str) -> bool:
    """
    Return whether the user holds at least the given role in a group.

    Site admins and org admins of the group's parent organization
    always satisfy this check, regardless of their group-level role.

    Parameters
    ----------
    user : AuthUser
        The user to check.
    group : Group
        The group to check the role within.
    role : str
        The minimum role required.

    Returns
    -------
    bool
        True if the user is a site admin, an org admin of the group's
        organization, or their group role meets or exceeds ``role``,
        False otherwise.
    """
    if getattr(user, "is_admin", False):
        return True
    if has_org_role_atleast(user, group.org, enums.MembershipRole.ADMIN):
        return True
    membership = get_group_membership(user, group=group)
    if membership is None:
        return False
    return (
        membership.role_level
        >= enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(role)]
    )


ORG_ACTION_REQUIREMENTS = {
    "view_org": enums.MembershipRole.GUEST,
    "post_org_update": enums.MembershipRole.MEMBER,
    "invite_org_member": enums.MembershipRole.COORDINATOR,
    "create_group": enums.MembershipRole.COORDINATOR,
    "remove_org_member": enums.MembershipRole.ADMIN,
    "delete_org": enums.MembershipRole.ADMIN,
}


GROUP_ACTION_REQUIREMENTS = {
    "view_group": enums.MembershipRole.GUEST,
    "post_group_update": enums.MembershipRole.MEMBER,
    "invite_group_member": enums.MembershipRole.COORDINATOR,
    "remove_group_member": enums.MembershipRole.ADMIN,
    "delete_group": enums.MembershipRole.ADMIN,
}


def has_org_permission(user: AuthUser, org: Organization, action: str) -> bool:
    """
    Return whether the user is permitted to perform an action in an organization.

    Parameters
    ----------
    user : AuthUser
        The user to check.
    org : Organization
        The organization the action would be performed in.
    action : str
        Key identifying the action, as defined in
        ``ORG_ACTION_REQUIREMENTS``.

    Returns
    -------
    bool
        True if the user's role in the organization meets the
        action's required role, False otherwise.
    """
    required_role = ORG_ACTION_REQUIREMENTS[action]
    return has_org_role_atleast(user, org, required_role)


def has_group_permission(user: AuthUser, group: Group, action: str) -> bool:
    """
    Return whether the user is permitted to perform an action in a group.

    Parameters
    ----------
    user : AuthUser
        The user to check.
    group : Group
        The group the action would be performed in.
    action : str
        Key identifying the action, as defined in
        ``GROUP_ACTION_REQUIREMENTS``.

    Returns
    -------
    bool
        True if the user's role in the group meets the action's
        required role, False otherwise.
    """
    required_role = GROUP_ACTION_REQUIREMENTS[action]
    return has_group_role_atleast(user, group, required_role)


try:
    from rest_framework.permissions import BasePermission

    class HasOrgPermission(BasePermission):
        def has_permission(self, request: Any, view: Any) -> bool:
            action_map = getattr(view, "action_permission_map", {})
            required_action = action_map.get(getattr(view, "action", None))

            if required_action is None:
                return True

            org = view.get_organization()
            return has_org_permission(request.user, org, required_action)

    class HasGroupPermission(BasePermission):
        def has_permission(self, request: Any, view: Any) -> bool:
            action_map = getattr(view, "action_permission_map", {})
            required_action = action_map.get(getattr(view, "action", None))

            if required_action is None:
                return True

            group = view.get_group()
            return has_group_permission(request.user, group, required_action)

except ImportError:
    pass
