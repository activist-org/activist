# SPDX-License-Identifier: AGPL-3.0-or-later
from uuid import uuid4

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupTextFactory

pytestmark = pytest.mark.django_db


def test_group_text_update():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = False
    user.save()

    group = GroupFactory(created_by=user)
    texts = GroupTextFactory(group=group)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(
        path=f"/v1/communities/group_texts/{texts.id}",
        data={"description": "New test description for this group.", "iso": "en"},
    )

    assert response.status_code == 200


def test_group_text_update_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = False
    user.save()

    group = GroupFactory()
    texts = GroupTextFactory(group=group)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(
        path=f"/v1/communities/group_texts/{texts.id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to update to this group's text."
    )


def test_event_text_update_404():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = False
    user.save()

    bad_texts_id = uuid4()

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    response = client.put(
        path=f"/v1/communities/group_texts/{bad_texts_id}",
        data={"description": "New test description for this group."},
    )
    response_body = response.json()

    assert response.status_code == 404
    assert response_body["detail"] == "Group text not found."
