# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for the events app models.
"""

import pytest

from events.factories import EventFactory
from events.models import EventText

pytestmark = pytest.mark.django_db


def test_event_text_str_methods() -> None:
    """
    Test string representation method for EventText model.
    """
    event = EventFactory.create()
    event_texts = EventText.objects.create(
        event=event,
        iso="en",
        primary=True,
        description="Test description",
        get_involved="Get involved text",
    )
    assert str(event_texts) == f"{event_texts.event} - {event_texts.iso}"
