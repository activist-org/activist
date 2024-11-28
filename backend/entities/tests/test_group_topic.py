"""
Test cases for GroupTopic model.
"""

import pytest

from entities.factories import GroupFactory, GroupTopicFactory
from entities.models import GroupTopic

pytestmark = pytest.mark.django_db


def test_group_topic_str() -> None:
    """Test string representation of GroupTopic model."""
    group_topic = GroupTopicFactory.build()
    assert str(group_topic) == f"{group_topic.id}"


def test_group_topic_creation() -> None:
    """Test creating a GroupTopic instance."""
    group = GroupFactory()
    topic = GroupTopicFactory(group_id=group)

    assert isinstance(topic, GroupTopic)
    assert topic.group_id == group


def test_multiple_topics_per_group() -> None:
    """Test multiple topics for a single group."""
    group = GroupFactory()
    topics = [GroupTopicFactory(group_id=group) for _ in range(3)]

    assert len(topics) == 3
    for topic in topics:
        assert topic.group_id == group


def test_group_topic_deletion() -> None:
    """Test cascade deletion when group is deleted."""
    group = GroupFactory()
    topic = GroupTopicFactory(group_id=group)

    # Store topic ID for later verification.
    topic_id = topic.id

    # Delete the group.
    group.delete()

    # Verify topic is also deleted.
    assert not GroupTopic.objects.filter(id=topic_id).exists()
