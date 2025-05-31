# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the GroupImage model.
"""

import os

import pytest
from django.conf import settings

from communities.groups.factories import GroupFactory, GroupImageFactory
from content.factories import ImageFactory

pytestmark = pytest.mark.django_db


def test_group_image_str_methods() -> None:
    """
    Test string representation of GroupImage model.
    """
    group = GroupFactory()
    image = ImageFactory()
    group_image = GroupImageFactory(group=group, image=image, sequence_index=1)

    assert str(group_image) == f"{group_image.id}"

    # Cleanup after the test.
    file_path = os.path.join(settings.MEDIA_ROOT, image.file_object.name)
    if os.path.exists(file_path):
        os.remove(file_path)
