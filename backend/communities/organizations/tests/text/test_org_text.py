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
    org_text = OrganizationTextFactory.build()
    assert hasattr(org_text, "description")


def test_org_text_languages() -> None:
    """
    Test organization text with different ISO languages.
    """
    org = OrganizationFactory()

    # 1. Test primary language text.
    primary_text = OrganizationTextFactory(
        org=org,
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
    secondary_text = OrganizationTextFactory(
        org=org,
        iso="spa",
        primary=False,
        description="Description",
        get_involved="How to participate",
        donate_prompt="Donation prompt",
    )
    assert secondary_text.primary is False
    assert secondary_text.iso == "spa"
    assert secondary_text.description == "Description"
