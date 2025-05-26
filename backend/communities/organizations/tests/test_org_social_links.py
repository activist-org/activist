# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)

pytestmark = pytest.mark.django_db


def test_org_social_links_update(client: Client) -> None:
    """
    Test Organization Social Link updates.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    test_user = "test_user"
    test_plaintext_password = "test_password"
    user = UserFactory(username=test_user, plaintext_password=test_plaintext_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory()
    org.created_by = user

    social_links = OrganizationSocialLinkFactory()
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_user, "password": test_plaintext_password},
    )

    assert login_response.status_code == 200

    # MARK: Update Success

    login_body = login_response.json()
    token = login_body["token"]

    response = client.put(
        path=f"/v1/communities/organization_social_links/{org.id}/",
        data={"link": test_link, "label": test_label, "order": test_order},
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200

    # MARK: Update Failure

    bad_uuid = uuid4()
    response = client.put(
        path=f"/v1/communities/organization_social_links/{bad_uuid}/",
        data={"link": test_link, "label": test_label, "order": test_order},
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 404

    response_body = response.json()
    assert response_body["error"] == "Organization not found"
