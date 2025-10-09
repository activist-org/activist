# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for discussion entry string methods.
"""

from uuid import uuid4

import pytest
from django.utils import timezone

from authentication.factories import UserFactory
from content.models import Discussion, DiscussionEntry

pytestmark = pytest.mark.django_db


def test_discussion_entry_str_method():
    """
    Test the __str__ method of the DiscussionEntry model.
    """
    user = UserFactory()
    discussion = Discussion(
        id=uuid4(),
        created_by=user,
        title="Test Discussion",
        creation_date=timezone.now(),
    )
    discussion.save()

    entry_id = uuid4()
    entry = DiscussionEntry(
        id=entry_id,
        discussion=discussion,
        created_by=user,
        text="Test Entry",
        creation_date=timezone.now(),
        last_updated=timezone.now(),
    )
    assert str(entry) == f"{entry_id}"
