from .factories import ResourceFactory, TaskFactory, TopicFactory, ResourceTopicFactory
from tests.throttle import BaseTestThrottle
from django.urls import reverse


import pytest

from django.test import TestCase


class ContentThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("content:resource-list")


@pytest.mark.django_db
def test_str_methods() -> None:
    resource = ResourceFactory.build()
    task = TaskFactory.build()
    topics = TopicFactory.build()
    resource_topics = ResourceTopicFactory.create()
    assert str(resource) == resource.name
    assert str(task) == task.name
    assert str(topics) == topics.name
    assert str(resource_topics) == str(resource_topics.id)
