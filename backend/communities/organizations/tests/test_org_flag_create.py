# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_flag_create():
    """
    Test to create a flag for an organization.
    """
    client = APIClient()
    test_username = "test_user"
    test_pass = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.save()

    org = OrganizationFactory()

    error_response = client.post(
        path="/v1/communities/organization_flag/",
        data={"flagged_org": org.id, "created_by": user.id},
        content_type="application/json",
    )

    assert error_response.status_code == 401

    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.post(
        path="/v1/communities/organization_flag/",
        data={"created_by": user.id, "org": org.id},
    )

    print(org)

    assert response.status_code == 201
