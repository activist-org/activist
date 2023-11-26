from .factory import ResourceFactory, TaskFactory, TopicFactory, ResourceTopicFactory
from tests.test_base import BaseTestThrottle
from django.urls import reverse


import pytest

from django.contrib.auth.models import User

from tests.test_base import BaseTestThrottle

from django.test import RequestFactory, TestCase


class ContentThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("content:resource-list")
    anon_throttle = "7/min"
    user_throttle = "10/min"


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
