# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Enums for the authentication app.
"""

from enum import Enum

from django.db import models


class StatusTypes(Enum):
    """
    Represents the possible statuses of a user.
    """

    PENDING = 1
    ACTIVE = 2
    SUSPENDED = 3
    BANNED = 4


class MembershipRole(models.TextChoices):
    """
    Defines the roles for Users, specifically in regards to organizations that they belong to.

    Note: All organization roles are transferred to all sub-entities (groups and events).
    """

    UNAUTHENTICATED = "unauthenticated", "Unauthenticated"
    USER = "user", "User"
    ALLY = "ally", "Ally"
    MEMBER = "member", "Member"
    COORDINATOR = "coordinator", "Coordinator"
    ADMIN = "admin", "Admin"


MEMBERSHIP_ROLE_LEVELS = {
    MembershipRole.UNAUTHENTICATED: 0,
    MembershipRole.USER: 1,
    MembershipRole.ALLY: 2,
    MembershipRole.MEMBER: 3,
    MembershipRole.COORDINATOR: 4,
    MembershipRole.ADMIN: 5,
}
