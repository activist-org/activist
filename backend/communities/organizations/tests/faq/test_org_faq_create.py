# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

import pytest

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)

pytestmark = pytest.mark.django_db

# MARK: Update


def test_org_faq_create(authenticated_client) -> None:
    """
    Test Organization FAQ creations.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory(created_by=user)

    faqs = OrganizationFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

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


def test_org_faq_create_unathorized(authenticated_client) -> None:
    client, user = authenticated_client
    user.is_staff = False
    user.save()

    org = OrganizationFactory()

    faqs = OrganizationFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

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

    assert response.status_code == 403