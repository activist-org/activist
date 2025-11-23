# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from events.factories import EventFactory, EventResourceFactory

pytestmark = pytest.mark.django_db


def test_event_resource_delete_200(authenticated_client):
    """
    Test successful deletion of an event resource by the event owner.
    """
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
    )

    event = EventFactory(created_by=user)
    resource = EventResourceFactory(created_by=user, event=event)

    # Login to get token
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Delete the resource as the owner
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/events/event_resources/{resource.id}")

    assert response.status_code == 204


def test_event_resource_delete_403(authenticated_client):
    """
    Test that non-owner cannot delete an event resource.
    """
    client = APIClient()

    # Create owner user
    owner_user = UserFactory(
        username="owner",
        plaintext_password="owner_pass",
        is_confirmed=True,
        verified=True,
    )

    # Create non-owner user
    test_username = "test_user"
    test_password = "test_pass"
    UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
    )

    event = EventFactory(created_by=owner_user)
    resource = EventResourceFactory(created_by=owner_user, event=event)

    # Login as non-owner
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Try to delete the resource as non-owner
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/events/event_resources/{resource.id}")

    assert response.status_code == 204


def test_event_resource_delete_404(authenticated_client):
    """
    Test deletion of non-existent event resource returns 404.
    """
    client, _ = authenticated_client

    # Try to delete non-existent resource
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.delete(path=f"/v1/events/event_resources/{fake_uuid}")

    assert response.status_code == 404


def test_event_resource_delete_staff_200():
    """
    Test that staff users can delete any event resource.
    """
    client = APIClient()

    # Create owner user.
    owner_user = UserFactory(
        username="owner",
        plaintext_password="owner_pass",
        is_confirmed=True,
        verified=True,
    )

    # Create staff user.
    test_username = "staff_user"
    test_password = "staff_pass"
    UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
        is_staff=True,
    )

    event = EventFactory(created_by=owner_user)
    resource = EventResourceFactory(created_by=owner_user, event=event)

    # Login as staff.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Delete the resource as staff.
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/events/event_resources/{resource.id}")

    assert response.status_code == 204
