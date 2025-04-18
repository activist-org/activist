# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from communities.organizations.factories import (
    OrganizationFactory,
)

pytestmark = pytest.mark.django_db


def test_org_list_images(client: Client) -> None:
    org = OrganizationFactory()
    org_id = org.id

    response = client.get(
        path=f"/v1/communities/organizations/{org_id}/images/",
    )

    assert response.status_code == 200
