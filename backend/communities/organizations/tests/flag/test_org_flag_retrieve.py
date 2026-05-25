# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.organizations.factories import OrganizationFlagFactory

pytestmark = pytest.mark.django_db


def test_org_flag_retrieve_ok_200(authenticated_client):
    """
    Test to retrieve a flag of an organization.
    """
    client, user = authenticated_client

    flag = OrganizationFlagFactory()

    response = client.get(path=f"/v1/communities/organization_flags/{flag.id}")

    assert response.status_code == status.HTTP_200_OK


def test_org_flag_retrieve_not_found_404(authenticated_client):
    """
    Test to retrieve a flag of an organization.
    """
    client, user = authenticated_client

    flag = uuid4()

    response = client.get(path=f"/v1/communities/organization_flags/{flag}")
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Failed to retrieve the flag."
