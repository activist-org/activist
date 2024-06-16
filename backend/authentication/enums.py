"""
Enums for the authentication app.
More details about Enums can be found in schema section on Figma.
"""

from enum import Enum


class StatusTypes(Enum):
    PENDING = 1
    ACTIVE = 2
    SUSPENDED = 3
    BANNED = 4


class SupportEntityTypes(Enum):
    ORGANIZATION = 1
    GROUP = 2
    EVENT = 3
    USER = 4
