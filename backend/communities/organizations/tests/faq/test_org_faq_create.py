# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

import pytest
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)

pytestmark = pytest.mark.django_db

# MARK: Update


def test_org_faq_create() -> None:
    """
    Test Organization FAQ updates.

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

    org = OrganizationFactory(created_by=user)

    faqs = OrganizationFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    # Login to get token.
    login_response = client.post(
        path="/v1/auth/sign_in",
        data={"username": test_username, "password": test_password},
    )

    assert login_response.status_code == 200

    # MARK: Update Success

    login_body = login_response.json()
    token = login_body["token"]

    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")

    response = client.post(
        path="/v1/communities/organization_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "org": org.id,
        },
        format="json",
    )

    assert response.status_code == 201

    # MARK: Update Failure

    response = client.post(
        path="/v1/communities/organization_faqs",
        data={
            "question": "",
            "answer": "",
            "order": test_order,
            "org": org.id,
        },
        format="json",
    )

    assert response.status_code == 400
