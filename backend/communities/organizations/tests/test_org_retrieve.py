# SPDX-License-Identifier: AGPL-3.0-or-later
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
