# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_partial_update(client: Client) -> None:
    test_username = "test_user"
    test_plaintext_password = "test_pass"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    org = OrganizationFactory()
    org_id = org.id

    """
    Un-authorized user updating org info.
    """

    response = client.patch(
        path=f"/v1/communities/organizations/{org_id}/",
        data={"orgName": "new_org", "name": "test_org"},
    )

    assert response.status_code == 401
    response_body = response.json()
    assert (
        response_body["error"] == "You are not authorized to update this organization"
    )

    """
    Org does not exist.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200
    login_response_json = login_response.json()
    token = login_response_json["token"]

    bad_org_id = uuid4()
    org.created_by = user

    response = client.patch(
        path=f"/v1/communities/organizations/{bad_org_id}/",
        data={"orgName": "new_org", "name": "test_org"},
        headers={"Authorization": f"Token {str(token)}"},
        content_type="application/json",
    )

    assert response.status_code == 404
    response_body = response.json()
    assert response_body["error"] == "Organization not found"

    """
    Authorized User updating Org info.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200
    login_response_json = login_response.json()
    token = login_response_json["token"]

    org.created_by = user

    response = client.patch(
        path=f"/v1/communities/organizations/{org_id}/",
        data={"orgName": "new_org", "name": "test_org"},
        headers={"Authorization": f"Token {str(token)}"},
        content_type="application/json",
    )

    assert response.status_code == 200
