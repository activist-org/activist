# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from django.test import Client

from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_retrieve(client: Client) -> None:
    org = OrganizationFactory()

    response = client.get(
        path=f"/v1/communities/organizations/{org.id}/",
    )

    assert response.status_code == 200

    bad_org_id = uuid4()
    response = client.get(path=f"/v1/communities/organizations/{bad_org_id}/")
    assert response.status_code == 404
    response_body = response.json()
    assert response_body["detail"] == "Failed to retrieve the organization."
