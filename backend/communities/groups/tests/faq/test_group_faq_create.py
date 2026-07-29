# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import (
    GroupFactory,
    GroupFaqFactory,
)

pytestmark = pytest.mark.django_db

# MARK: Update


def test_group_faq_create_ok_200() -> None:
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
    client = APIClient()

    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    group = GroupFactory(created_by=user)

    faqs = GroupFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == status.HTTP_200_OK

    # MARK: Update Success

    login_body = login_response.json()
    token = login_body["access"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(
        path="/v1/communities/group_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "group": group.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED

    # MARK: Update Failure

    response = client.post(
        path="/v1/communities/group_faqs",
        data={
            "question": "",
            "answer": "",
            "order": test_order,
            "group": group.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_group_faq_create_forbidden_403() -> None:
    """
    Test creating a Group FAQ with a user that is not the creator of the group returns 403.
    """
    client = APIClient()

    owner = UserFactory()
    group = GroupFactory(created_by=owner)

    other_user_password = "other_user_password"
    other_user = UserFactory(plaintext_password=other_user_password)
    other_user.is_confirmed = True
    other_user.verified = True
    other_user.save()

    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": other_user.username, "password": other_user_password},
    )
    assert login_response.status_code == status.HTTP_200_OK
    token = login_response.json()["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    faqs = GroupFaqFactory()
    response = client.post(
        path="/v1/communities/group_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": faqs.question,
            "answer": faqs.answer,
            "order": faqs.order,
            "group": group.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_group_faq_create_unauthorized_401() -> None:
    """
    Test creating a Group FAQ with an unauthenticated client returns 401.
    """
    client = APIClient()
    group = GroupFactory()
    faqs = GroupFaqFactory()

    response = client.post(
        path="/v1/communities/group_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": faqs.question,
            "answer": faqs.answer,
            "order": faqs.order,
            "group": group.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED

