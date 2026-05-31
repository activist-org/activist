# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

from uuid import uuid4

import pytest
from django.test import Client
from rest_framework import status

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
)

pytestmark = pytest.mark.django_db


def _get_login(client: Client, staff_user=False):
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = staff_user
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    access_token = login_response.json()

    return {
        "status_code": login_response.status_code,
        "access_token": access_token["access"],
        "user": user,
    }


def test_org_social_link_update_ok_200(client: Client) -> None:
    login_details = _get_login(client, staff_user=True)

    org = OrganizationFactory(created_by=login_details["user"])

    social_links = OrganizationSocialLinkFactory(org=org)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    assert login_details["status_code"] == status.HTTP_200_OK

    response = client.put(
        path=f"/v1/communities/organization_social_links/{social_links.id}",
        data={"link": test_link, "label": test_label, "order": test_order},
        headers={"Authorization": f"Token {login_details['access_token']}"},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_200_OK
    assert response_body["message"] == "Social link updated successfully."


def test_org_social_link_update_not_found_404(client: Client):
    login_details = _get_login(client, staff_user=True)

    org = OrganizationFactory(created_by=login_details["user"])

    social_links = OrganizationSocialLinkFactory(org=org)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    assert login_details["status_code"] == status.HTTP_200_OK

    bad_social_link_uuid = uuid4()
    response = client.put(
        path=f"/v1/communities/organization_social_links/{bad_social_link_uuid}",
        data={"link": test_link, "label": test_label, "order": test_order},
        headers={"Authorization": f"Token {login_details['access_token']}"},
        content_type="application/json",
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response_body["detail"] == "Social link not found."


def test_org_social_link_update_not_creator_or_admin_forbidden_403(client: Client):
    login_details = _get_login(client)

    org = OrganizationFactory()

    social_links = OrganizationSocialLinkFactory(org=org)
    test_link = social_links.link
    test_label = social_links.label
    test_order = social_links.order

    assert login_details["status_code"] == status.HTTP_200_OK

    response = client.put(
        path=f"/v1/communities/organization_social_links/{social_links.id}",
        data={"link": test_link, "label": test_label, "order": test_order},
        content_type="application/json",
        headers={"Authorization": f"Token {login_details['access_token']}"},
    )
    response_body = response.json()

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert (
        response_body["detail"]
        == "You are not authorized to update the social links for this organization."
    )
