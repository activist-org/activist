from uuid import UUID

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory

pytestmark = pytest.mark.django_db


def test_update_group(client: Client) -> None:
    """
    Test Cases:
        1. Unauthorized user trying to update data.
        2. Authorized client updates data.
        3. Bad UUID gives group as None.
    """
    group = GroupFactory.create()
    group_id = group.id

    update_group_name = "Test_Group_Name_123"
    update_name = "testname123"

    # 1. Unauthorized user trying to update data.
    response = client.put(
        path=f"/v1/communities/groups/{group_id}/",
        data={
            "group_name": update_group_name,
            "name": update_name,
        },
    )

    assert response.status_code == 401

    # 2. Authorized client updates data.
    plaintext_password = "Activist@123!?"
    user = UserFactory(plaintext_password=plaintext_password)
    user.is_confirmed = True
    user.is_staff = True
    user.save()
    login_response = client.put(
        path="/v1/auth/sign_in/",
        data={
            "email": user.email,
            "password": plaintext_password,
        },
    )

    if login_response.status_code == 200:
        response = client.put(
            path=f"/v1/communities/groups/{group_id}/",
            data={
                "group_name": update_group_name,
                "name": update_name,
            },
        )
        assert response.status_code == 200

    # 3. Bad UUID gives group as None.
    bad_uuid = UUID
    response = client.put(
        path=f"/v1/communities/groups/{bad_uuid}/",
        data={
            "group_name": update_group_name,
            "name": update_name,
        },
    )

    assert response.status_code == 404
