# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

from content.models import Location


def test_location_str_method():
    """
    Test the __str__ method of the Location model.
    """
    location_id = uuid4()
    location = Location(
        id=location_id, lat="40.7128", lon="-74.0060", display_name="New York City"
    )
    assert str(location) == f"{location_id}"
