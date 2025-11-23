# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupResourceFactory

pytestmark = pytest.mark.django_db


def test_group_resource_retrieve_200():
    """
    Test retrieving a specific group resource.
    """
    client = APIClient()

    user = UserFactory()
    group = GroupFactory(created_by=user)
    resource = GroupResourceFactory(created_by=user, group=group)

    response = client.get(path=f"/v1/communities/group_resources/{resource.id}")
    assert response.status_code == 200

    response_body = response.json()
    assert response_body["id"] == str(resource.id)
    assert response_body["name"] == resource.name
    assert response_body["description"] == resource.description


def test_group_resource_retrieve_404():
    """
    Test retrieving a non-existent group resource returns 404.
    """
    client = APIClient()

    fake_uuid = "00000000-0000-0000-0000-000000000000"
    response = client.get(path=f"/v1/communities/group_resources/{fake_uuid}")

    assert response.status_code == 404
