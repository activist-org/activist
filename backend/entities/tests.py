from django.test import TestCase
from django.urls import reverse
from tests.throttle import BaseTestThrottle


class EntitiesThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("entities:organization-list")
