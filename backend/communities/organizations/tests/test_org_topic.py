"""
Test cases for OrganizationTopic model.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_org_topic_creation() -> None:
    """Test creating a OrganizationTopic instance."""
    org = OrganizationFactory()
    topic = TopicFactory()

    org.topics.set([topic])

    assert isinstance(org.topics.first(), Topic)
    assert org.topics.first() == topic


def test_multiple_topics_per_org() -> None:
    """Test multiple topics for a single organization."""
    org = OrganizationFactory()
    topics = TopicFactory.create_batch(3)

    org.topics.set(topics)

    assert len(topics) == 3
    for topic in topics:
        assert topic in org.topics.all()
