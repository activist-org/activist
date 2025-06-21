# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFlagFactory

pytestmark = pytest.mark.django_db


def test_org_flag_delete():
    """
    Test to delete a flag of an organization.
    """
    client = APIClient()

    test_username = "username"
    test_pass = "password"
    user = UserFactory(username=test_username, plaintext_password=test_pass)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    flag = OrganizationFlagFactory()

    # Login to get token.
    login = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_pass},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.delete(path=f"/v1/communities/organization_flag/{flag.id}/")

    assert response.status_code == 204
