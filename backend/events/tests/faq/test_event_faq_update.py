# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

from uuid import uuid4

import pytest
from rest_framework import status

from events.factories import EventFactory, EventFaqFactory

pytestmark = pytest.mark.django_db

# MARK: Update


def test_event_faq_update(authenticated_client) -> None:
    """
    Test Event FAQ updates.

    Parameters
    ----------
    client : Client
        A Django test client used to send HTTP requests to the application.

    Returns
    -------
    None
        This test asserts the correctness of status codes (200 for success, 404 for not found).
    """
    client, user = authenticated_client

    event = EventFactory(created_by=user)

    faqs = EventFaqFactory(event=event)
    test_id = faqs.id
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.put(
        path=f"/v1/events/event_faqs/{test_id}",
        data={
            "id": test_id,
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK


def test_event_faq_update_not_found_404(authenticated_client):
    client, user = authenticated_client
    test_uuid = uuid4()

    event = EventFactory(created_by=user)

    faqs = EventFaqFactory(event=event)
    test_id = faqs.id
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.put(
        path=f"/v1/events/event_faqs/{test_uuid}",
        data={
            "id": test_id,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_event_faq_update_forbidden_403(authenticated_client) -> None:
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.is_staff = False
    user.save()

    event = EventFactory()

    faqs = EventFaqFactory(event=event)
    test_id = faqs.id
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.put(
        path=f"/v1/events/event_faqs/{test_id}",
        data={
            "id": test_id,
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
