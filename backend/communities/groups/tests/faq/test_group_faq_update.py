# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the group social link methods.
"""

from uuid import uuid4

import pytest

from communities.groups.factories import GroupFactory, GroupFaqFactory

pytestmark = pytest.mark.django_db

# MARK: Update


def test_group_faq_update(authenticated_client) -> None:
    """
    Test Group FAQ updates.
    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client

    group = GroupFactory(created_by=user)

    faqs = GroupFaqFactory(group=group)
    test_id = faqs.id
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.put(
        path=f"/v1/communities/group_faqs/{test_id}",
        data={
            "id": test_id,
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        format="json",
    )

    assert response.status_code == 200

    # MARK: Update Failure

    test_uuid = uuid4()

    response = client.put(
        path=f"/v1/communities/group_faqs/{test_uuid}",
        data={
            "id": test_id,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        content_type="application/json",
    )

    assert response.status_code == 404


def test_group_faq_update_unauthorized(authenticated_client) -> None:
    """
    Test Group FAQ updates.
    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client
    user.is_staff = False
    user.save()
    group = GroupFactory()

    faqs = GroupFaqFactory(group=group)
    test_id = faqs.id
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.put(
        path=f"/v1/communities/group_faqs/{test_id}",
        data={
            "id": test_id,
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        format="json",
    )

    assert response.status_code == 403
