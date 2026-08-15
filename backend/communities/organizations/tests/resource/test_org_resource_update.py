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
    org_resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = org_resource.name
    test_desc = org_resource.description
    test_url = org_resource.url
    test_order = org_resource.order

    response = client.put(
        path=f"/v1/communities/organization_resources/{org_resource.id}",
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
    org_resource = OrganizationResourceFactory(org=org)

    topic = TopicFactory()
    original_values = (
        org_resource.name,
        org_resource.description,
        org_resource.url,
        org_resource.order,
    )

    response = client.put(
        path=f"/v1/communities/organization_resources/{org_resource.id}",
        data={
            "name": "Updated resource name",
            "description": "Updated resource description",
            "url": "https://example.com/updated-resource",
            "order": org_resource.order + 1,
            "org": org.id,
            "topic": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response_body["detail"] == "You are not authorized to update this resource."

    org_resource.refresh_from_db()
    assert (
        org_resource.name,
        org_resource.description,
        org_resource.url,
        org_resource.order,
    ) == original_values


def test_org_resource_update_not_found_404(authenticated_client):
    client, user = authenticated_client

    invalid_org_resource_id = uuid4()

    org = OrganizationFactory()
    org_resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = TopicFactory()

    test_name = org_resource.name
    test_desc = org_resource.description
    test_url = org_resource.url
    test_order = org_resource.order

    response = client.put(
        path=f"/v1/communities/organization_resources/{invalid_org_resource_id}",
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
