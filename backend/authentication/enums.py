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


class SupportEntityTypes(Enum):
    """
    Defines the types of entities that can support users.
    """

    ORGANIZATION = 1
    GROUP = 2
    EVENT = 3
    USER = 4


class MembershipRole(models.TextChoices):
    """
    Defines the roles for the Users.
    """

    GUEST = "guest", "Guest"
    USER = "user", "User"
    ALLIES = "allies", "Allies"
    ADMIN = "admin", "Admin"
    MEMBER = "member", "Member"
    COORDINATOR = "coordinator", "Coordinator"


MEMBERSHIP_ROLE_LEVELS = {
    MembershipRole.GUEST: 0,
    MembershipRole.USER: 1,
    MembershipRole.ALLIES: 2,
    MembershipRole.MEMBER: 3,
    MembershipRole.COORDINATOR: 4,
    MembershipRole.ADMIN: 5,
}
