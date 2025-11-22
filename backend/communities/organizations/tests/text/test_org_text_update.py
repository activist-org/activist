# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationTextFactory,
)

pytestmark = pytest.mark.django_db


def test_org_text_update(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)
    texts = OrganizationTextFactory(org=org)

    response = client.put(
        path=f"/v1/communities/organization_texts/{texts.id}",
        data={
            "description": "New test description for this organization.",
            "iso": "en",
        },
    )

    assert response.status_code == 200


def test_org_text_update_403(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory()
    texts = OrganizationTextFactory(org=org)

    response = client.put(
        path=f"/v1/communities/organization_texts/{texts.id}",
        data={"description": "New test description for this organization."},
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update this organization's text."
    )


def test_org_text_update_404(authenticated_client):
    client, user = authenticated_client

    bad_texts_id = uuid4()

    response = client.put(
        path=f"/v1/communities/organization_texts/{bad_texts_id}",
        data={"description": "New test description for this organization."},
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Organization text not found."
