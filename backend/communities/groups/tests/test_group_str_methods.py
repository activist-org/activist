# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the communities app.
"""

# mypy: ignore-errors
import pytest

from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_str_methods() -> None:
    """
    Test the __str__ methods for groups.
    """
    group = GroupFactory.create()

    assert str(group) == group.name
