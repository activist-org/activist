# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.groups.factories import GroupFactory, GroupResourceFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_group_resource_update_ok_200(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    group_resource = GroupResourceFactory(created_by=user, group=group)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = group_resource.name
    test_desc = group_resource.description
    test_url = group_resource.url
    test_order = group_resource.order

    response = client.put(
        path=f"/v1/communities/group_resources/{group_resource.id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "group": group.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["message"] == "Resource updated successfully."


def test_group_resource_update_forbidden_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()
    group_resource = GroupResourceFactory(group=group)

    topic = TopicFactory()
    original_values = (
        group_resource.name,
        group_resource.description,
        group_resource.url,
        group_resource.order,
    )

    response = client.put(
        path=f"/v1/communities/group_resources/{group_resource.id}",
        data={
            "name": "Updated resource name",
            "description": "Updated resource description",
            "url": "https://example.com/updated-resource",
            "order": group_resource.order + 1,
            "group": group.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response_body["detail"] == "You are not authorized to update this resource."

    group_resource.refresh_from_db()
    assert (
        group_resource.name,
        group_resource.description,
        group_resource.url,
        group_resource.order,
    ) == original_values


def test_group_resource_update_not_found_404(authenticated_client):
    client, user = authenticated_client

    invalid_group_resource_id = uuid4()

    group = GroupFactory()
    group_resource = GroupResourceFactory(created_by=user, group=group)

    topic = TopicFactory()

    test_name = group_resource.name
    test_desc = group_resource.description
    test_url = group_resource.url
    test_order = group_resource.order

    response = client.put(
        path=f"/v1/communities/group_resources/{invalid_group_resource_id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "group": group.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Resource not found."
