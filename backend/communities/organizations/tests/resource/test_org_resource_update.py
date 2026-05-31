# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_org_resource_update_ok_200(authenticated_client):
    client, user = authenticated_client
    org = OrganizationFactory(created_by=user)
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/organization_resources/{resource.id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "org": org.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["message"] == "Resource updated successfully."


def test_org_resource_update_forbidden_403(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory()
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/organization_resources/{resource.id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "org": org.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response_body["detail"] == "You are not authorized to update this resource."


def test_org_resource_update_not_found_404(authenticated_client):
    client, user = authenticated_client

    bad_resource_id = uuid4()

    org = OrganizationFactory()
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    response = client.put(
        path=f"/v1/communities/organization_resources/{bad_resource_id}",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "org": org.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Resource not found."
