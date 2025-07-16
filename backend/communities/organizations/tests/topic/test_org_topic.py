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
    topics = TopicFactory.create_batch(3)

    org.topics.set(topics)

    assert len(topics) == 3
    for topic in topics:
        assert topic in org.topics.all()
