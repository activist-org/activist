# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

from uuid import uuid4

import pytest

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

    assert response.status_code == 200

    # MARK: Update Failure

    test_uuid = uuid4()

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

    assert response.status_code == 404


def test_event_faq_update_not_authorized(authenticated_client) -> None:
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

    assert response.status_code == 403
