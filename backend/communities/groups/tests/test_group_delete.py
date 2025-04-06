from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_group_delete(client: Client) -> None:
    # Create User and Group
    test_username = "test_user"
    test_plaintext_password = "test_pass"
    user = UserFactory(
        username=test_username, plaintext_password=test_plaintext_password
    )
    group = GroupFactory()

    """
    1. Un-Authorized user trying to delete group (not part of the staff).
    """
    user.is_confirmed = True
    user.verified = True
    user.save()

    group.created_by = user

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200
    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}/",
        headers={"Authorization": "Token " + str(token)},
    )

    assert delete_response.status_code == 401
    delete_response_json = delete_response.json()
    assert (
        delete_response_json["error"] == "You are not authorized to delete this group"
    )

    """
    2. Group id not found.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    test_uuid = uuid4()

    group.created_by = user

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200
    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{test_uuid}/",
        headers={"Authorization": "Token " + str(token)},
    )

    assert delete_response.status_code == 404
    delete_response_json = delete_response.json()
    assert delete_response_json["error"] == "Group not found"

    """
    3. User is confirmed and is_staff.
    """
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    group.created_by = user

    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={
            "username": test_username,
            "password": test_plaintext_password,
        },
    )

    assert login_response.status_code == 200
    login_response_body = login_response.json()
    token = login_response_body.get("token")

    delete_response = client.delete(
        path=f"/v1/communities/groups/{group.id}/",
        headers={"Authorization": "Token " + str(token)},
    )

    assert delete_response.status_code == 200
