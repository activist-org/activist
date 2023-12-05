from django.test import TestCase
from django.urls import reverse
from tests.test_base import BaseTestThrottle


class EntitiesThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("entities:organization-list")
    anon_throttle = "7/min"
    user_throttle = "10/min"
