# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)
from communities.organizations.models import OrganizationResource
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_org_resource_create_ok_200(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)
    org_resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = org_resource.name
    test_desc = org_resource.description
    test_url = org_resource.url
    test_order = org_resource.order

    response = client.post(
        path="/v1/communities/organization_resources",
        data={
            "name": test_name,
            "description": test_desc,
            "url": test_url,
            "order": test_order,
            "org": org.id,
            "topics": [topic.type],
        },
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert response_body["message"] == "Resource created successfully."


def test_org_resource_create_forbidden_403(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory()
    org_resource = OrganizationResourceFactory.build(created_by=user, org=org)

    topic = TopicFactory()
    resource_count_before = OrganizationResource.objects.count()

    test_name = org_resource.name
    test_desc = org_resource.description
    test_url = org_resource.url
    test_order = org_resource.order

    response = client.post(
        path="/v1/communities/organization_resources",
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
    assert (
        response_body["detail"]
        == "You are not authorized to create resource for this organization."
    )
    assert OrganizationResource.objects.count() == resource_count_before
