# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import OrganizationSupport

pytestmark = pytest.mark.django_db

ORG_SUPPORTS_ENDPOINT = "/v1/communities/org_supports"


def test_org_support_list_ok_200(authenticated_client):
    client, user = authenticated_client
    organization = OrganizationFactory()
    support = OrganizationSupport.objects.create(
        organization=organization, user_supporter=user
    )

    response = client.get(path=ORG_SUPPORTS_ENDPOINT)
    response_body = response.json()
    results = response_body["results"]

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 1
    assert len(results) == 1
    assert results[0]["id"] == str(support.id)
    assert results[0]["organization"] == str(organization.id)
    assert results[0]["userSupporter"] == str(user.id)


def test_org_support_list_empty_ok_200(authenticated_client):
    client, user = authenticated_client

    response = client.get(path=ORG_SUPPORTS_ENDPOINT)
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 0
    assert response_body["results"] == []


def test_org_support_list_unauthenticated_ok_200():
    client = APIClient()

    response = client.get(path=ORG_SUPPORTS_ENDPOINT)
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["count"] == 0
    assert response_body["results"] == []
