# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the organization social link methods.
"""

import pytest
from rest_framework import status

from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)
from communities.organizations.models import OrganizationFaq

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

    org_faq = OrganizationFaqFactory()
    test_question = org_faq.question
    test_answer = org_faq.answer
    test_order = org_faq.order

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

    assert response.status_code == status.HTTP_201_CREATED


def test_org_faq_create_bad_request_400(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    org = OrganizationFactory(created_by=user)

    org_faq = OrganizationFaqFactory()
    test_order = org_faq.order

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

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_org_faq_create_forbidden_403(authenticated_client) -> None:
    client, user = authenticated_client

    org = OrganizationFactory()

    org_faq = OrganizationFaqFactory.build(org=org)
    faq_count_before = OrganizationFaq.objects.count()

    response = client.post(
        path="/v1/communities/organization_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": org_faq.question,
            "answer": org_faq.answer,
            "order": org_faq.order,
            "org": org.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.data["detail"] == (
        "You are not authorized to create FAQs for this organization."
    )
    assert OrganizationFaq.objects.count() == faq_count_before
