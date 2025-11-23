# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupResourceFactory

pytestmark = pytest.mark.django_db


def test_group_resource_list():
    """
    Test to list all group resources.
    """
    client = APIClient()

    user = UserFactory()
    group = GroupFactory(created_by=user)

    # Create multiple resources
    GroupResourceFactory.create_batch(3, group=group, created_by=user)

    response = client.get(path="/v1/communities/group_resources")

    assert response.status_code == 200
    response_body = response.json()
    assert len(response_body) >= 3


def test_group_resource_list_empty():
    """
    Test listing group resources when none exist.
    """
    client = APIClient()

    response = client.get(path="/v1/communities/group_resources")

    assert response.status_code == 200
    response_body = response.json()
    # API returns paginated response
    assert "results" in response_body
    assert response_body["count"] == 0
    assert response_body["results"] == []
