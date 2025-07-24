# SPDX-License-Identifier: AGPL-3.0-or-later

from communities.organizations.factories import OrganizationFlagFactory


def test_org_flag_delete(authenticated_client):
    """
    Test to delete a flag of an organization.
    """
    flag = OrganizationFlagFactory()
    response = authenticated_client.delete(path=f"/v1/communities/organization_flag/{flag.id}")

    assert response.status_code == 204
