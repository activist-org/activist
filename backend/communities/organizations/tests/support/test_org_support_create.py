# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import OrganizationSupport

pytestmark = pytest.mark.django_db


def test_org_support_created_201(authenticated_client):
	client, user = authenticated_client
	organization = OrganizationFactory()

	response = client.post(
		path=f"/v1/communities/org_supports/{organization.id}",
		data={"supporter_type": "user"},
	)

	assert response.status_code == status.HTTP_201_CREATED
	assert OrganizationSupport.objects.filter(
		organization=organization, user_supporter=user
	).exists()


def test_org_support_create_unauthorized_401():
	client = APIClient()
	organization = OrganizationFactory()

	response = client.post(
		path=f"/v1/communities/org_supports/{organization.id}",
		data={"supporter_type": "user"},
	)
	response_body = response.json()

	assert response.status_code == status.HTTP_401_UNAUTHORIZED
	assert response_body["detail"] == "Authentication credentials were not provided."
