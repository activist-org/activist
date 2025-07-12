# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for OrganizationTopic model.
"""

import pytest

from communities.organizations.factories import OrganizationFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_org_topic_create() -> None:
    """
    Test creating a OrganizationTopic instance.
    """
    org = OrganizationFactory()
    topic = TopicFactory()

    org.topics.set([topic])

    assert isinstance(org.topics.first(), Topic)
    assert org.topics.first() == topic
