# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

import pytest
from rest_framework import status

from events.factories import EventFactory, EventFaqFactory

pytestmark = pytest.mark.django_db

# MARK: Update


def test_event_faq_create_ok_200(authenticated_client) -> None:
    """
    Test Event FAQ updates.

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

    event = EventFactory(created_by=user)

    faqs = EventFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.post(
        path="/v1/events/event_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "event": event.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_201_CREATED


def test_event_faq_create_bad_request_400(authenticated_client):
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    event = EventFactory(created_by=user)

    faqs = EventFaqFactory()
    test_order = faqs.order

    response = client.post(
        path="/v1/events/event_faqs",
        data={
            "question": "",
            "answer": "",
            "order": test_order,
            "event": event.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_event_faq_create_forbidden_403(authenticated_client) -> None:
    client, user = authenticated_client
    user.is_confirmed = True
    user.verified = True
    user.is_staff = False
    user.save()

    event = EventFactory()

    faqs = EventFaqFactory()
    test_question = faqs.question
    test_answer = faqs.answer
    test_order = faqs.order

    response = client.post(
        path="/v1/events/event_faqs",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "event": event.id,
        },
        format="json",
    )

    assert response.status_code == status.HTTP_403_FORBIDDEN
