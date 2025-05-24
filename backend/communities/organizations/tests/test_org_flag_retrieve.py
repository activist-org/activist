# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from communities.organizations.factories import OrganizationFlagFactory

pytestmark = pytest.mark.django_db


def test_org_flag_retrieve():
    """
    Test to retrieve a flag of an organization.
    """
    client = APIClient()

    flag = OrganizationFlagFactory()

    response = client.get(path=f"/v1/communities/organization_flag/{flag.id}/")

    assert response.status_code == 200
