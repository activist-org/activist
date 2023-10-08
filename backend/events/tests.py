from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User

from .models import Event, Format, Role

TESTING_THRESHOLD = 1
API_THRESHOLD = str(TESTING_THRESHOLD) + "/min"


@override_settings(
    REST_FRAMEWORK={
        "DEFAULT_THROTTLE_CLASSES": [
            "rest_framework.throttling.AnonRateThrottle",
            "rest_framework.throttling.UserRateThrottle",
        ],
        "DEFAULT_THROTTLE_RATES": {"anon": API_THRESHOLD, "user": API_THRESHOLD},
    }
)
class EventAPIThrottlingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.event_url = reverse("events:event-list")

        self.event = Event.objects.create(name="Test Event")
        self.format = EventFormat.objects.create(name="Test Format")
        self.role = Role.objects.create(name="Test Role")

        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

    def tearDown(self):
        self.user.delete()
        self.event.delete()
        self.format.delete()
        self.role.delete()

    def test_anon_api_throttling(self):
        for _ in range(TESTING_THRESHOLD):
            response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_auth_api_throttling(self):
        for _ in range(TESTING_THRESHOLD):
            self.client.force_authenticate(user=self.user)
            response = self.client.get(self.event_url)
        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
