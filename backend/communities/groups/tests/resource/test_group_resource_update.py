# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupResourceFactory
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_group_resource_update_200(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory(created_by=user)
    resource = GroupResourceFactory(created_by=user, group=group)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/group_resources/{resource.id}",
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

    assert response.status_code == 200
    assert response_body["message"] == "Resource updated successfully."


def test_group_resource_update_403(authenticated_client):
    client, user = authenticated_client

    group = GroupFactory()
    resource = GroupResourceFactory(created_by=user, group=group)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/group_resources/{resource.id}",
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

    assert response.status_code == 403
    assert response_body["detail"] == "You are not authorized to update this resource."


def test_group_resource_update_404(authenticated_client):
    client, user = authenticated_client

    bad_resource_id = uuid4()

    group = GroupFactory()
    resource = GroupResourceFactory(created_by=user, group=group)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/group_resources/{bad_resource_id}",
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

    assert response.status_code == 404
    assert response_body["detail"] == "Resource not found."
