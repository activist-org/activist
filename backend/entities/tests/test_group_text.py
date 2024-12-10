"""
Test cases for the GroupText model.
"""

import pytest

from entities.factories import GroupFactory, GroupTextFactory

pytestmark = pytest.mark.django_db


def test_group_text_str() -> None:
    """Test string representation of GroupText model."""
    group_text = GroupTextFactory.build()
    assert hasattr(group_text, "description")


def test_group_text_languages() -> None:
    """Test group text with different ISO languages."""
    group = GroupFactory()

    # 1. Test primary language text.
    primary_text = GroupTextFactory(
        group_id=group,
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
        group_id=group,
        iso="spa",
        primary=False,
        description="Descripción",
        get_involved="Cómo participar",
        donate_prompt="Prompt de donación",
    )
    assert secondary_text.primary is False
    assert secondary_text.iso == "spa"
    assert secondary_text.description == "Descripción"


def test_group_text_field_lengths() -> None:
    """Test field length constraints."""
    group = GroupFactory()

    text = GroupTextFactory(
        group_id=group,
        iso="eng",
        description="A" * 500,
        get_involved="B" * 500,
        donate_prompt="C" * 500,
    )
    assert len(text.description) <= 500
    assert len(text.get_involved) <= 500
    assert len(text.donate_prompt) <= 500
    assert len(text.iso) <= 3
