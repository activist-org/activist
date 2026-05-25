# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework import status

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)

pytestmark = pytest.mark.django_db


def test_org_social_link_delete_no_content_204(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)
    social_links = OrganizationSocialLinkFactory(org=org)

    response = client.delete(
        path=f"/v1/communities/organization_social_links/{social_links.id}"
    )

    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_org_social_link_delete_not_found_404(authenticated_client):
    client, user = authenticated_client

    bad_uuid = uuid4()

    response = client.delete(
        path=f"/v1/communities/organization_social_links/{bad_uuid}",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
