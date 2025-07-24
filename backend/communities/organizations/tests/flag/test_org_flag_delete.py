# # SPDX-License-Identifier: AGPL-3.0-or-later

import pytest

from communities.organizations.factories import OrganizationFlagFactory


@pytest.mark.django_db
def test_org_flag_delete_authenticated(authenticated_client):
    """Test that an authenticated user can successfully delete an organization flag."""
    flag = OrganizationFlagFactory()
    response = authenticated_client.delete(f"/v1/communities/organization_flag/{flag.id}")
    assert response.status_code == 204

@pytest.mark.django_db
def test_org_flag_delete_unauthenticated(client):
    """Test that an unauthenticated user cannot delete an organization flag."""
    flag = OrganizationFlagFactory()
    response = client.delete(f"/v1/communities/organization_flag/{flag.id}")
    assert response.status_code == 401

@pytest.mark.django_db
def test_org_flag_delete_not_found(authenticated_client):
    """Test that deleting a non-existent organization flag returns a 404 error."""
    fake_id = 999999  # ou str(uuid4()) si le modèle utilise des UUID
    response = authenticated_client.delete(f"/v1/communities/organization_flag/{fake_id}")
    assert response.status_code == 404
