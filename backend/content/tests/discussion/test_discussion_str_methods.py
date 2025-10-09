# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for discussion string methods.
"""

from uuid import uuid4

import pytest
from django.utils import timezone

from authentication.factories import UserFactory
from content.models import Discussion

pytestmark = pytest.mark.django_db


def test_discussion_str_method():
    """
    Test the __str__ method of the Discussion model.
    """
    user = UserFactory()
    discussion = Discussion(
        id=uuid4(),
        created_by=user,
        title="Test Discussion",
        creation_date=timezone.now(),
    )
    assert str(discussion) == f"{discussion.id}"
