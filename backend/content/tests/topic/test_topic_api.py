# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from content.factories import TopicFactory

pytestmark = pytest.mark.django_db


def test_topic_list():
    """
    Test to list all active topics.
    """
    client = APIClient()

    # Create active topics
    active_topic_1 = TopicFactory(active=True, type="Environment")
    active_topic_2 = TopicFactory(active=True, type="Education")

    # Create inactive topic (should not appear in results)
    TopicFactory(active=False, type="Inactive")

    response = client.get(path="/v1/content/topics")

    assert response.status_code == 200
    assert len(response.data) == 2

    # Verify that only active topics are returned
    returned_ids = [topic["id"] for topic in response.data]
    assert str(active_topic_1.id) in returned_ids
    assert str(active_topic_2.id) in returned_ids

    # Verify topic data structure
    assert "type" in response.data[0]
    assert "active" in response.data[0]


def test_topic_list_empty():
    """
    Test to list topics when no active topics exist.
    """
    client = APIClient()

    # Create only inactive topics
    TopicFactory(active=False, type="Inactive1")
    TopicFactory(active=False, type="Inactive2")

    response = client.get(path="/v1/content/topics")

    assert response.status_code == 200
    assert len(response.data) == 0


def test_topic_list_no_topics():
    """
    Test to list topics when no topics exist at all.
    """
    client = APIClient()

    response = client.get(path="/v1/content/topics")

    assert response.status_code == 200
    assert len(response.data) == 0
