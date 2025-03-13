# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupImage model.
"""

import pytest

from communities.groups.factories import GroupFactory, GroupImageFactory
from content.factories import ImageFactory

pytestmark = pytest.mark.django_db


def test_group_image_str() -> None:
    """Test string representation of GroupImage model."""
    group = GroupFactory()
    image = ImageFactory()
    group_image = GroupImageFactory(group=group, image=image, sequence_index=1)

    assert str(group_image) == f"{group_image.id}"
