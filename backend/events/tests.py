from django.test import TestCase
from django.urls import reverse
from tests.throttle import BaseTestThrottle


class EventsThrottleTest(BaseTestThrottle):
    __test__ = True
    url = reverse("events:event-list")
