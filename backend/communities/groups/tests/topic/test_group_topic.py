# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupTopic model.
"""

import pytest

from communities.groups.factories import GroupFactory
from content.factories import TopicFactory

pytestmark = pytest.mark.django_db


def test_group_topic_multiple_topics() -> None:
    """
    Test multiple topics for a single group.
    """
    group = GroupFactory()
    topics = TopicFactory.create_batch(3)

    group.topics.set(topics)

    assert len(topics) == 3
    for topic in topics:
        assert topic in group.topics.all()
