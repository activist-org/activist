# SPDX-License-Identifier: AGPL-3.0-or-later

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupSocialLinkFactory

pytestmark = pytest.mark.django_db


def test_group_social_link_create_200():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.verified = True
    user.is_confirmed = True
    user.is_staff = True
    user.save()

    group = GroupFactory(created_by=user)

    social_links = GroupSocialLinkFactory(group=group)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(
        path="/v1/communities/group_social_links",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
            "group": group.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == 201
    assert response_body["message"] == "Social link created successfully."


def test_group_social_link_create_403():
    client = APIClient()

    test_username = "test_user"
    test_password = "test_pass"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.verified = True
    user.is_confirmed = True
    user.save()

    group = GroupFactory()

    social_links = GroupSocialLinkFactory(group=group)

    login = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login.status_code == 200

    login_body = login.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(
        path="/v1/communities/group_social_links",
        data={
            "link": social_links.link,
            "label": social_links.label,
            "order": social_links.order,
            "group": group.id,
        },
        content_type="application/json",
    )

    response_body = response.json()

    assert response.status_code == 403
    assert (
        response_body["detail"]
        == "You are not authorized to create social links for this group."
    )
