# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)
from communities.organizations.models import OrganizationSocialLink

pytestmark = pytest.mark.django_db


def test_org_social_link_create_ok_200(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)

    org_social_link = OrganizationSocialLinkFactory(org=org)

    response = client.post(
        path="/v1/communities/organization_social_links",
        data={
            "link": org_social_link.link,
            "label": org_social_link.label,
            "order": org_social_link.order,
            "org": org.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert response_body["message"] == "Social link created successfully."


def test_org_social_link_create_forbidden_403(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory()

    org_social_link = OrganizationSocialLinkFactory.build(org=org)
    social_link_count_before = OrganizationSocialLink.objects.count()

    response = client.post(
        path="/v1/communities/organization_social_links",
        data={
            "link": org_social_link.link,
            "label": org_social_link.label,
            "order": org_social_link.order,
            "org": org.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to create social links for this organization."
    )
    assert OrganizationSocialLink.objects.count() == social_link_count_before
