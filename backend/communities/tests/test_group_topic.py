# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupTopic model.
"""

import pytest

from communities.factories import GroupFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_group_topic_creation() -> None:
    """Test creating a GroupTopic instance."""
    group = GroupFactory()
    topic = TopicFactory()

    group.topics.set([topic])

    assert isinstance(group.topics.first(), Topic)
    assert group.topics.first() == topic


def test_multiple_topics_per_group() -> None:
    """Test multiple topics for a single group."""
    group = GroupFactory()
    topics = TopicFactory.create_batch(3)

    group.topics.set(topics)

    assert len(topics) == 3
    for topic in topics:
        assert topic in group.topics.all()
