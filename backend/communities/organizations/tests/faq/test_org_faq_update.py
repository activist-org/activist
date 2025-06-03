# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

from uuid import uuid4

import pytest
from django.test import Client

from authentication.factories import UserFactory
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)

pytestmark = pytest.mark.django_db

# MARK: Update


def test_org_faq_update(client: Client) -> None:
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
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory()
    org.created_by = user

    faqs = OrganizationFaqFactory()
    test_id = faqs.id
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

    response = client.put(
        path=f"/v1/communities/organization_faqs/{org.id}/",
        data={
            "id": test_id,
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 200

    # MARK: Update Failure

    bad_uuid = uuid4()
    response = client.put(
        path=f"/v1/communities/organization_faqs/{bad_uuid}/",
        data={
            "id": test_id,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 404

    response_body = response.json()
    assert response_body["detail"] == "Organization not found."
