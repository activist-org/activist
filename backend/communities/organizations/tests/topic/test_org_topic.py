# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationTopic model.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from content.factories import TopicFactory

pytestmark = pytest.mark.django_db


def test_org_topic_multiple_topics() -> None:
    """
    Test multiple topics for a single organization.
    """
    org = OrganizationFactory()

    # Note: Creating a random topic runs the chance of creating the same topic twice.
    topic_1 = TopicFactory.create()
    topic_2 = TopicFactory.create(type="A_DIFFERENT_TOPIC")
    topics = [topic_1, topic_2]

    org.topics.set(topics)

    assert len(topics) == 2
    for topic in topics:
        assert topic in org.topics.all()
