# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from django.test import Client
from rest_framework import status
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import OrganizationSupport

pytestmark = pytest.mark.django_db


def test_org_retrieve(client: Client) -> None:
    org = OrganizationFactory()

    response = client.get(
        path=f"/v1/communities/organizations/{org.id}",
    )

    assert response.status_code == status.HTTP_200_OK
    response_body = response.json()
    assert response_body["id"] == str(org.id)
    assert response_body["name"] == org.name
    assert response_body["tagline"] == org.tagline


def test_org_retrieve_unauthenticated_ok_200() -> None:
    client = APIClient()
    org = OrganizationFactory()

    response = client.get(path=f"/v1/communities/organizations/{org.id}")
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["id"] == str(org.id)


def test_org_retrieve_supported_by_authenticated_user(authenticated_client) -> None:
    client, user = authenticated_client
    org = OrganizationFactory()
    OrganizationSupport.objects.create(organization=org, user_supporter=user)

    response = client.get(path=f"/v1/communities/organizations/{org.id}")
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["id"] == str(org.id)


def test_org_retrieve_not_found_404(client: Client):
    invalid_org_id = uuid4()
    response = client.get(path=f"/v1/communities/organizations/{invalid_org_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response_body = response.json()
    assert response_body["detail"] == "Failed to retrieve the organization."
