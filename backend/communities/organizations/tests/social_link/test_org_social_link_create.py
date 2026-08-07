# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import status

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)
from communities.organizations.models import OrganizationSocialLink

pytestmark = pytest.mark.django_db


def test_org_social_link_create_ok_200(authenticated_client):
    client, user = authenticated_client

    org = OrganizationFactory(created_by=user)

    social_links = OrganizationSocialLinkFactory(org=org)

    response = client.post(
        path="/v1/communities/organization_social_links",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
            "org": org.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == status.HTTP_201_CREATED
    assert response_body["message"] == "Social link created successfully."


def test_org_social_link_create_forbidden_403(authenticated_client):
    client, user = authenticated_client

    org_owner = UserFactory()
    org = OrganizationFactory(created_by=org_owner)

    social_link = OrganizationSocialLinkFactory.build(org=org)
    social_link_count_before = OrganizationSocialLink.objects.count()

    response = client.post(
        path="/v1/communities/organization_social_links",
        data={
            "link": social_link.link,
            "label": social_link.label,
            "order": social_link.order,
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
