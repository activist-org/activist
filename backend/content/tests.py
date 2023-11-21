from .factory import ResourceFactory, TaskFactory, TopicFactory, ResourceTopicFactory
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from rest_framework import status
from django.urls import reverse
from django.test import TestCase, override_settings
from django.core.cache import cache
import time
from rest_framework.response import Response
from rest_framework.request import Request
from django.contrib.auth.models import User
from rest_framework.views import APIView

from django.contrib.auth.models import User
import pytest

from django.contrib.auth.models import User
from .views import (
    ResourceViewSet,
    TaskViewSet,
    TopicViewSet,
    ResourceTopicViewSet,
    TopicFormatViewSet,
)

from django.test import RequestFactory, TestCase

from rest_framework.throttling import (
    AnonRateThrottle, BaseThrottle, ScopedRateThrottle, SimpleRateThrottle,
    UserRateThrottle
)


TESTING_THRESHOLD = 1
API_THRESHOLD = str(TESTING_THRESHOLD) + "/min"

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

## Test for API Rate Throttling
@pytest.mark.django_db
def test_anon_rate_throttle():
    client = APIClient()

    # Make 7 requests from the same IP address within a minute
    for _ in range(7):
        response = client.get(reverse("content:resource-list"))
        assert response.status_code == 200

    # Make another request and expect a 429 Too Many Requests response
    response = client.get(reverse("content:resource-list"))
    assert response.status_code == status.HTTP_429_TOO_MANY_REQUESTS 

###
'''
class ContentAPIThrottlingTest(APITestCase):

    def setUp(self):
        cache.clear()
        self.factory = APIRequestFactory()
    
    def test_anon_throttle(self):
        url = reverse("content:resource-list")
        request = self.factory.get(url)
        for _ in range(7):
            response = ResourceViewSet.as_view({'get': 'list'})(request)

        assert response.status_code == 429
'''
###
'''
class User3SecRateThrottle(UserRateThrottle):
    rate = '3/sec'
    scope = 'seconds'

class Anon3SecRateThrottle(AnonRateThrottle):
    rate = '3/sec'
    scope = 'seconds'

class AnonMockView(APIView):
    throttle_classes = (Anon3SecRateThrottle,) # User3SecRateThrottle

    def get(self, request):
        return Response('foo')

class UserMockView(APIView):
    throttle_classes = (User3SecRateThrottle,)

    def get(self, request):
        return Response('bar')

class MockViewAnon(APIView):
    throttle_classes = (AnonRateThrottle)

    def get(self, request):
        return Response('foo')

class ContentAPIThrottlingTests(TestCase):
    def setUp(self):
        """
        Reset the cache so that no throttles will be active
        """
        cache.clear()
        self.factory = APIRequestFactory()

    def test_anon_requests_throttling(self):
        """
        Ensure request rate is limited
        """
        request = self.factory.get(reverse("content:resource-list")) # get('/')
        for dummy in range(10): # 4
            response = AnonMockView.as_view()(request) # AnonMockView
        assert response.status_code == 429
    
    def set_throttle_timer(self, view, value):
        """
        Explicitly set the timer, overriding time.time()
        """
        for cls in view.throttle_classes:
            cls.timer = lambda self: value

    def test_anon_request_throttling_expires(self):
        """
        Ensure request rate is limited for a limited duration only
        """
        self.set_throttle_timer(MockViewAnon, 0)

        request = self.factory.get('/')
        for dummy in range(10): # 4
            response = AnonMockView.as_view()(request)
        assert response.status_code == 429

        # Advance the timer by one second
        self.set_throttle_timer(AnonMockView, 60)

        response = AnonMockView.as_view()(request)
        assert response.status_code == 200
    
    def test_auth_request_throttling(self):
        """
        Ensure authenticated user request rate is limited
        """
        request = self.factory.get(reverse("content:resource-list"))
        user = User.objects.create(username='test')
        force_authenticate(request, user)
        request.user = user

        for _ in range(4):
            response = UserMockView.as_view()(request)
        assert response.status_code == 429
    
    def test_auth_request_throttling_expires(self):
        self.set_throttle_timer(UserMockView, 0)

        request = self.factory.get('/') #
        for _ in range(4):
            response = UserMockView.as_view()(request)
        assert response.status_code == 429

        # Advance the timer by one second
        self.set_throttle_timer(UserMockView, 1)

        response = UserMockView.as_view()(request)
        assert response.status_code == 200
    
    def test_fail_this(self):
        assert 1 == 2
'''





# self.resource_url = reverse("content:resource-list")
        