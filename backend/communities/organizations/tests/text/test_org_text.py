# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the OrganizationText model.
"""

import pytest

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationTextFactory,
)

pytestmark = pytest.mark.django_db


def test_org_text_str() -> None:
    """
    Test string representation of OrganizationText model.
    """
    org_texts = OrganizationTextFactory.build()
    assert hasattr(org_texts, "description")


def test_org_text_languages() -> None:
    """
    Test organization text with different ISO languages.
    """
    org = OrganizationFactory()

    # Test primary language text.
    primary_org_texts = OrganizationTextFactory(
        org=org,
        iso="eng",
        primary=True,
        description="Primary description",
        get_involved="Get involved text",
        donate_prompt="Donation prompt",
    )
    assert primary_org_texts.primary is True
    assert primary_org_texts.iso == "eng"
    assert primary_org_texts.description == "Primary description"

    # Test secondary language text.
    secondary_org_texts = OrganizationTextFactory(
        org=org,
        iso="spa",
        primary=False,
        description="Description",
        get_involved="How to participate",
        donate_prompt="Donation prompt",
    )
    assert secondary_org_texts.primary is False
    assert secondary_org_texts.iso == "spa"
    assert secondary_org_texts.description == "Description"
