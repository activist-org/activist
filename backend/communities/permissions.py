# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Permission checks and membership lookups for organizations and groups.

Also defines the DRF permission classes built on top of these checks.
"""

from __future__ import annotations

from typing import Any, Union
from uuid import UUID

from rest_framework.permissions import BasePermission

from authentication import enums
from authentication.models import UserModel
from communities.groups.models import Group
from communities.organizations.models import Organization, OrganizationMember
from events.models import Event

AuthUser = Union[UserModel, UUID, None]


ACTION_REQUIREMENTS = {
    "view_org": enums.MembershipRole.UNAUTHENTICATED,
    "post_org_update": enums.MembershipRole.MEMBER,
    "invite_org_member": enums.MembershipRole.COORDINATOR,
    "create_group": enums.MembershipRole.COORDINATOR,
    "remove_org_member": enums.MembershipRole.ADMIN,
    "delete_org": enums.MembershipRole.ADMIN,
}


class HasOrgPermission(BasePermission):
    """
    Organization permission class.
    """

    def has_permission(self, request: Any, view: Any) -> bool:
        """
        Whether the user has permission for the given action.

        Parameters
        ----------
        request : Any
            The request that includes the user that needs its permissions checked.

        view : Any
            The view to use in the action.

        Returns
        -------
        bool
            Whether the user has permission for the given action or not.
        """
        action_map = getattr(view, "action_permission_map", {})
        required_action = action_map.get(getattr(view, "action", None))

        if required_action is None:
            return True

        org = view.get_organization()
        return has_org_permission(request.user, org, required_action)


# MARK: Get Membership


def get_org_membership(user: AuthUser, org: Organization) -> OrganizationMember | None:
    """
    Get a user's membership record in an organization.

    Parameters
    ----------
    user : AuthUser
        The user to look up. Unauthenticated users (or None) always
        resolve to no membership.

    org : Organization
        The organization to check membership in.

    Returns
    -------
    OrganizationMember or None
        The user's membership record, or None if the user is not
        authenticated or has no membership in the organization.
    """
    if not getattr(user, "is_authenticated", False):
        return None

    return OrganizationMember.objects.filter(org=org, user=user).first()


def get_group_membership(user: AuthUser, group: Group) -> OrganizationMember | None:
    """
    Get a user's membership record in a group.

    Note: Group membership inherits from its organization.

    Parameters
    ----------
    user : AuthUser
        The user to look up. Unauthenticated users (or None) always
        resolve to no membership.

    group : Group
        The group to check membership in.

    Returns
    -------
    OrganizationMember or None
        The user's membership record, or None if the user is not
        authenticated or has no membership in the group.
    """
    if not getattr(user, "is_authenticated", False):
        return None

    org = group.org

    return OrganizationMember.objects.filter(org=org, user=user).first()


def get_event_membership(user: AuthUser, event: Event) -> OrganizationMember | None:
    """
    Get a user's membership record in an event.

    Note: Event membership inherits from its organization(s).
    Note: We will eventually expand events to work with more than one organization.

    Parameters
    ----------
    user : AuthUser
        The user to look up. Unauthenticated users (or None) always
        resolve to no membership.

    event : Event
        The event to check membership in.

    Returns
    -------
    OrganizationMember or None
        The user's membership record, or None if the user is not
        authenticated or has no membership in the event.
    """
    if not getattr(user, "is_authenticated", False):
        return None

    org = event.orgs.first()

    return OrganizationMember.objects.filter(org=org, user=user).first()


# MARK: Has Minimum Role


def has_minimum_org_role(user: AuthUser, org: Organization, role: str) -> bool:
    """
    Return whether the user holds at least the given role in an organization.

    Note: Site admins always satisfy this check, regardless of their role.

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
        meets or exceeds role, False otherwise.
    """
    if getattr(user, "is_admin", False):
        return True

    membership = get_org_membership(user=user, org=org)
    if membership is None:
        return False

    return (
        membership.role_level
        >= enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(role)]
    )


def has_minimum_group_role(user: AuthUser, group: Group, role: str) -> bool:
    """
    Return whether the user holds at least the given role in a group.

    Note: Group membership inherits from its organization.

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
        True if the user is a site admin or their organization role
        meets or exceeds role, False otherwise.
    """
    if getattr(user, "is_admin", False):
        return True

    org = group.org

    membership = get_org_membership(user=user, org=org)
    if membership is None:
        return False

    return (
        membership.role_level
        >= enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(role)]
    )


def has_minimum_event_role(user: AuthUser, event: Event, role: str) -> bool:
    """
    Return whether the user holds at least the given role in a event.

    Note: Event membership inherits from its organization(s).
    Note: We will eventually expand events to work with more than one organization.

    Parameters
    ----------
    user : AuthUser
        The user to check.

    event : Event
        The event to check the role within.

    role : str
        The minimum role required.

    Returns
    -------
    bool
        True if the user is a site admin or their organization role
        meets or exceeds role, False otherwise.
    """
    if getattr(user, "is_admin", False):
        return True

    org = event.orgs.first()
    if org is None:
        return False

    membership = get_org_membership(user=user, org=org)
    if membership is None:
        return False

    return (
        membership.role_level
        >= enums.MEMBERSHIP_ROLE_LEVELS[enums.MembershipRole(role)]
    )


# MARK: Has Permission


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
        ACTION_REQUIREMENTS.

    Returns
    -------
    bool
        True if the user's role in the organization meets the
        action's required role, False otherwise.
    """
    required_role = ACTION_REQUIREMENTS[action]
    return has_minimum_org_role(user=user, org=org, role=required_role)


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
        ACTION_REQUIREMENTS.

    Returns
    -------
    bool
        True if the user's role in the group meets the action's
        required role, False otherwise.
    """
    required_role = ACTION_REQUIREMENTS[action]
    return has_minimum_group_role(user=user, group=group, role=required_role)


def has_event_permission(user: AuthUser, event: Event, action: str) -> bool:
    """
    Return whether the user is permitted to perform an action in a event.

    Parameters
    ----------
    user : AuthUser
        The user to check.

    event : Event
        The event the action would be performed in.

    action : str
        Key identifying the action, as defined in
        ACTION_REQUIREMENTS.

    Returns
    -------
    bool
        True if the user's role in the group meets the action's
        required role, False otherwise.
    """
    required_role = ACTION_REQUIREMENTS[action]
    return has_minimum_event_role(user=user, event=event, role=required_role)
