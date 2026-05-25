# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.organizations.factories import OrganizationFlagFactory

pytestmark = pytest.mark.django_db


def test_org_flag_delete_no_content_204(authenticated_client):
    """
    Test to delete a flag of an organization.
    """
    client, user = authenticated_client

    # Set user as staff to have permission to delete flags
    user.is_staff = True
    user.save()

    flag = OrganizationFlagFactory()

    response = client.delete(path=f"/v1/communities/organization_flags/{flag.id}")

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_org_flag_delete_not_found_404(authenticated_client):
    client, user = authenticated_client

    bad_flagged_org_uuid = uuid4()
    response = client.delete(
        path=f"/v1/communities/organization_flags/{bad_flagged_org_uuid}"
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Flag not found."
