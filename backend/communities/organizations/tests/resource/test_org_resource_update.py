# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationResourceFactory,
)
from content.factories import TopicFactory
from content.models import Topic

pytestmark = pytest.mark.django_db


def test_org_resource_update_200():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory(created_by=user)
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = Topic.objects.create(type="test_type", active=True)

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()

    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

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

    assert response.status_code == 200
    assert response_body["message"] == "Resource updated successfully."


def test_org_resource_update_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    org = OrganizationFactory()
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()

    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

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

    assert response.status_code == 403
    assert response_body["detail"] == "You are not authorized to update this resource."


def test_org_resource_update_404():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.save()

    bad_resource_id = uuid4()

    org = OrganizationFactory()
    resource = OrganizationResourceFactory(created_by=user, org=org)
    topic = TopicFactory()

    test_name = resource.name
    test_desc = resource.description
    test_url = resource.url
    test_order = resource.order

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200
    login_body = login.json()

    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

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

    assert response.status_code == 404
    assert response_body["detail"] == "Resource not found."
