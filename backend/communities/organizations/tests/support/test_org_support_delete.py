# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.organizations.factories import OrganizationFactory
from communities.organizations.models import OrganizationSupport

pytestmark = pytest.mark.django_db


def test_org_support_delete_no_content_204(authenticated_client):
    client, user = authenticated_client
    organization = OrganizationFactory()
    support = OrganizationSupport.objects.create(
        organization=organization, user_supporter=user
    )

    response = client.delete(path=f"/v1/communities/org_supports/{organization.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not OrganizationSupport.objects.filter(id=support.id).exists()


def test_org_support_delete_not_found_404(authenticated_client):
    client, user = authenticated_client

    response = client.delete(path=f"/v1/communities/org_supports/{uuid4()}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Support for this organization not found."
