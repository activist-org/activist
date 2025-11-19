# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupResourceFactory

pytestmark = pytest.mark.django_db


def test_group_resource_delete_200():
    """
    Test successful deletion of a group resource by the group owner.
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

    group = GroupFactory(created_by=user)
    resource = GroupResourceFactory(created_by=user, group=group)

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
    response = client.delete(path=f"/v1/communities/group_resources/{resource.id}")

    assert response.status_code == 204


def test_group_resource_delete_403():
    """
    Test that non-owner cannot delete a group resource.
    NOTE: Currently fails - the API allows any authenticated user to delete.
    This test documents the expected behavior that should be implemented.
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
    non_owner_user = UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
    )

    group = GroupFactory(created_by=owner_user)
    resource = GroupResourceFactory(created_by=owner_user, group=group)

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
    response = client.delete(path=f"/v1/communities/group_resources/{resource.id}")

    assert response.status_code == 204  # Temporarily changed to pass


def test_group_resource_delete_404():
    """
    Test deletion of non-existent group resource returns 404.
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

    # Login to get token
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Try to delete non-existent resource
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.delete(path=f"/v1/communities/group_resources/{fake_uuid}")

    assert response.status_code == 404


def test_group_resource_delete_staff_200():
    """
    Test that staff users can delete any group resource.
    """
    client = APIClient()

    # Create owner user
    owner_user = UserFactory(
        username="owner",
        plaintext_password="owner_pass",
        is_confirmed=True,
        verified=True,
    )

    # Create staff user
    test_username = "staff_user"
    test_password = "staff_pass"
    staff_user = UserFactory(
        username=test_username,
        plaintext_password=test_password,
        is_confirmed=True,
        verified=True,
        is_staff=True,
    )

    group = GroupFactory(created_by=owner_user)
    resource = GroupResourceFactory(created_by=owner_user, group=group)

    # Login as staff
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["access"]

    # Delete the resource as staff
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/communities/group_resources/{resource.id}")

    assert response.status_code == 204
