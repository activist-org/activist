from uuid import uuid4

from rest_framework import status
from rest_framework.test import APITestCase

from authentication.factories import UserFactory
from events.factories import EventFactory, EventResourceFactory


class TestEventResourceUpdate(APITestCase):
    def setUp(self) -> None:
        self.event_creator = UserFactory(is_staff=False)

        self.staff_user = UserFactory(is_staff=True)

        self.other_user = UserFactory(is_staff=False)

        self.event = EventFactory(created_by=self.event_creator)
        self.resource = EventResourceFactory(event=self.event, name="Origin Resource")

        self.update_url = f"/v1/events/event_resources/{self.resource.id}"

        self.valid_data = {"name": "New Resource Name"}

    def test_update_resource_not_found(self):
        invalid_uuid = uuid4()

        url = f"/v1/events/event_resources/{invalid_uuid}"

        self.client.force_authenticate(user=self.staff_user)

        response = self.client.patch(url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_resource_by_creator_is_allowed(self):
        self.client.force_authenticate(user=self.event_creator)

        response = self.client.patch(self.update_url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.resource.refresh_from_db()
        self.assertEqual(self.resource.name, "New Resource Name")

    def test_update_resource_by_staff_is_allowed(self):
        self.client.force_authenticate(user=self.staff_user)

        response = self.client.patch(self.update_url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.resource.refresh_from_db()

        self.assertEqual(self.resource.name, "New Resource Name")

    def test_update_resource_by_other_user_is_forbidden(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.patch(self.update_url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.resource.refresh_from_db()
        self.assertEqual(self.resource.name, "Origin Resource")
