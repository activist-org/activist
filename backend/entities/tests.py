from django.test import TestCase
from django.urls import reverse
import tests


class EntitiesThrottleTest(tests.BaseTestThrottle):
    __test__ = True
    url = reverse("entities:organization-list")
    anon_throttle = "7/min"
    user_throttle = "10/min"
