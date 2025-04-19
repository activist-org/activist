# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.organizations.factories import OrganizationFactory

pytestmark = pytest.mark.django_db


def test_org_delete(client: Client) -> None:
    test_username = "test_user"
    test_plaintext_password = "test_pass"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    org = OrganizationFactory()

    """
    Un-authorized user deleting org info.
    """

    response = client.delete(
        path=f"/v1/communities/organizations/{org.id}/",
        data={"orgName": "new_org", "name": "test_org"},
    )

    assert response.status_code == 401
    response_body = response.json()
    assert (
        response_body["error"] == "You are not authorized to delete this organization"
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

    response = client.delete(
        path=f"/v1/communities/organizations/{bad_org_id}/",
        headers={"Authorization": f"Token {token}"},
    )

    assert response.status_code == 404
    response_body = response.json()
    assert response_body["error"] == "Organization not found"

    """
    Authorized User deleting Org info. (Uncomment test when the StatusType Class is more developed.)
    """
    # user.is_confirmed = True
    # user.verified = True
    # user.is_staff = True
    # user.save()

    # login_response = client.post(
    #     path="/v1/auth/sign_in/",
    #     data={
    #         "username": test_username,
    #         "password": test_plaintext_password,
    #     }
    # )

    # assert login_response.status_code == 200
    # login_response_json = login_response.json()
    # token = login_response_json["token"]

    # org.created_by = user

    # response = client.delete(
    #     path=f"/v1/communities/organizations/{org.id}/",
    #     headers={"Authorization": f"Token {token}"},
    # )

    # assert response.status_code == 200
    # response_body = response.json()
    # assert response_body["message"] == "Organization deleted successfully."
