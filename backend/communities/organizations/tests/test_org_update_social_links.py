# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)

pytestmark = pytest.mark.django_db


def test_org_update_social_links(client: Client) -> None:
    test_username = "test_username"
    test_plaintext_password = "test_password"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory()
    org.created_by = user

    links = OrganizationSocialLinkFactory()
    test_link = links.link
    test_label = links.label
    test_order = links.order

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_plaintext_password},
    )

    assert login_response.status_code == 200

    login_body = login_response.json()
    token = login_body["token"]

    response = client.put(
        path=f"/v1/communities/organization_social_links/{org.id}/",
        data={"link": test_link, "label": test_label, "order": test_order},
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200
