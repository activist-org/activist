# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from django.test import Client
from rest_framework import status

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_retrieve(client: Client) -> None:
    org = OrganizationFactory()

    response = client.get(
        path=f"/v1/communities/organizations/{org.id}",
    )

    assert response.status_code == status.HTTP_200_OK


def test_org_retrieve_not_found_404(client: Client):
    bad_org_id = uuid4()
    response = client.get(path=f"/v1/communities/organizations/{bad_org_id}")
    assert response.status_code == status.HTTP_404_NOT_FOUND

    response_body = response.json()
    assert response_body["detail"] == "Failed to retrieve the organization."
