# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupTopic model creation.
"""

import pytest

from communities.groups.factories import GroupFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_group_topic_create() -> None:
    """
    Test creating a GroupTopic instance.
    """
    group = GroupFactory()
    topic = TopicFactory()

    group.topics.set([topic])

    assert isinstance(group.topics.first(), Topic)
    assert group.topics.first() == topic
