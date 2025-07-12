# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

from django.utils import timezone

from content.models import Image


def test_image_str_methods():
    """
    Test the __str__ method of the Image model.
    """
    image_id = uuid4()
    image = Image(id=image_id, creation_date=timezone.now())
    assert str(image) == f"{image_id}"
