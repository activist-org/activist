# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

from django.utils import timezone

from content.models import Tag


def test_tag_str_method():
    """
    Test the __str__ method of the Tag model.
    """
    tag_id = uuid4()
    tag = Tag(
        id=tag_id,
        text="Test Tag",
        description="Test Description",
        creation_date=timezone.now(),
    )
    assert str(tag) == f"{tag_id}"
