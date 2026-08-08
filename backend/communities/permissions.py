# SPDX-License-Identifier: AGPL-3.0-or-later

from __future__ import annotations

from authentication import enums
from communities.groups.models import Group, GroupMember
from communities.organizations.models import Organization, OrganizationMember


def get_org_membership(user, org: Organization) -> OrganizationMember | None:
    if not getattr(user, "is_authenticated", False):
        return None
    return OrganizationMember.objects.filter(org=org, user=user).first()


def get_group_membership(user, group=Group) -> GroupMember | None:
    if not getattr(user, "is_authenticated", False):
        return None
    return GroupMember.objects.filter(group=group, user=user).first()


def has_org_role_atleast(user, org: Organization, role: str) -> bool:
    if getattr(user, "is_admin", False):
        return True
    membership = get_org_membership(user, org=org)
    if membership is None:
        return False
    return membership.role_level >= enums.MEMBERSHIP_ROLE_LEVELS[role]


def has_group_role_atleast(user, group: Group, role: str) -> bool:
    if getattr(user, "is_admin", False):
        return True
    if has_org_role_atleast(user, group.org, enums.MembershipRole.ADMIN):
        return True
    membership = get_group_membership(user, group=group)
    if membership is None:
        return False
    return membership.role_level >= enums.MembershipRole[role]


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


def has_org_permission(user, org: Organization, action: str) -> bool:
    required_role = ORG_ACTION_REQUIREMENTS[action]
    return has_org_role_atleast(user, org, required_role)


def has_group_permission(user, group: Group, action: str) -> bool:
    required_role = GROUP_ACTION_REQUIREMENTS[action]
    return has_group_role_atleast(user, group, required_role)


try:
    from rest_framework.permissions import BasePermission

    class HasOrgPermission(BasePermission):
        def has_permission(self, request, view):
            action_map = getattr(view, "action_permission_map", {})
            required_action = action_map.get(getattr(view, "action", None))

            if required_action is None:
                return True

            org = view.get_organization()
            return has_org_permission(request.user, org, required_action)

    class HasGroupPermission(BasePermission):
        def has_permission(self, request, view):
            action_map = getattr(view, "action_permission_map", {})
            required_action = action_map.get(getattr(view, "action", None))

            if required_action is None:
                return True

            group = view.get_group()
            return has_group_permission(request.user, group, required_action)

except ImportError:
    pass
