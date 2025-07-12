# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupText model.
"""

import pytest

from communities.groups.factories import GroupFactory, GroupTextFactory

pytestmark = pytest.mark.django_db


def test_group_text_str() -> None:
    """
    Test string representation of GroupText model.
    """
    group_text = GroupTextFactory.build()
    assert hasattr(group_text, "description")


def test_group_text_languages() -> None:
    """
    Test group text with different ISO languages.
    """
    group = GroupFactory()

    # 1. Test primary language text.
    primary_text = GroupTextFactory(
        group=group,
        iso="eng",
        primary=True,
        description="Primary description",
        get_involved="Get involved text",
        donate_prompt="Donation prompt",
    )
    assert primary_text.primary is True
    assert primary_text.iso == "eng"
    assert primary_text.description == "Primary description"

    # 2. Test secondary language text.
    secondary_text = GroupTextFactory(
        group=group,
        iso="spa",
        primary=False,
        description="Description",
        get_involved="How to participate",
        donate_prompt="Donation prompt",
    )
    assert secondary_text.primary is False
    assert secondary_text.iso == "spa"
    assert secondary_text.description == "Description"


def test_group_text_str_representation() -> None:
    """
    Test string representation of GroupText model.
    """
    group = GroupFactory()
    group_text = GroupTextFactory(group=group, iso="eng")

    assert str(group_text) == f"{group_text.group} - {group_text.iso}"
