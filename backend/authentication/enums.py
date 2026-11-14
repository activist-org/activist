# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Enums for the authentication app.
"""

from enum import Enum


class StatusTypes(Enum):
    """
    Represents the possible statuses of a user.
    """

    PENDING = 1
    ACTIVE = 2
    SUSPENDED = 3
    BANNED = 4
