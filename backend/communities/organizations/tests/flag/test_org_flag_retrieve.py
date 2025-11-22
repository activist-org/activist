# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from communities.organizations.factories import OrganizationFlagFactory

pytestmark = pytest.mark.django_db


def test_org_flag_retrieve(authenticated_client):
    """
    Test to retrieve a flag of an organization.
    """
    client, user = authenticated_client

    flag = OrganizationFlagFactory()

    response = client.get(path=f"/v1/communities/organization_flags/{flag.id}")

    assert response.status_code == 200


def test_org_flag_retrieve_does_not_exist(authenticated_client):
    """
    Test to retrieve a flag of an organization.
    """
    client, user = authenticated_client

    flag = uuid4()

    response = client.get(path=f"/v1/communities/organization_flags/{flag}")
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Failed to retrieve the flag."
