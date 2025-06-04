# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.groups.factories import (
    GroupFactory,
    GroupFaqFactory,
)

pytestmark = pytest.mark.django_db

# MARK: Update


def test_group_faq_create(client: Client) -> None:
    """
    Test Group FAQ updates.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    group = GroupFactory()
    group.created_by = user

    faqs = GroupFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in/",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    # MARK: Update Success

    login_body = login_response.json()
    token = login_body["token"]

    response = client.post(
        path="/v1/communities/group_faqs/",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "groupId": group.id,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 201

    # MARK: Update Failure

    response = client.post(
        path="/v1/communities/group_faqs/",
        data={
            "question": "",
            "answer": "",
            "order": test_order,
            "groupId": group.id,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 400
