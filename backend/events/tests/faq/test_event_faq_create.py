# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

import pytest

from events.factories import EventFactory, EventFaqFactory

pytestmark = pytest.mark.django_db

# MARK: Update


def test_event_faq_create(authenticated_client) -> None:
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

    assert response.status_code == 201

    # MARK: Update Failure

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

    assert response.status_code == 400


def test_event_faq_create_not_authorized(authenticated_client) -> None:
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

    assert response.status_code == 403
