# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event social link methods.
"""

import pytest
from django.test import Client

from authentication.factories import UserFactory
from events.factories import EventFactory, EventFaqFactory

pytestmark = pytest.mark.django_db

# MARK: Update


def test_event_faq_create(client: Client) -> None:
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
    test_username = "test_user"
    test_password = "test_password"
    user = UserFactory(username=test_username, plaintext_password=test_password)
    user.is_confirmed = True
    user.verified = True
    user.is_staff = True
    user.save()

    event = EventFactory()
    event.created_by = user

    faqs = EventFaqFactory()
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

    response = client.post(
        path="/v1/events/event_faqs/",
        data={
            "iso": "en",
            "primary": True,
            "question": test_question,
            "answer": test_answer,
            "order": test_order,
            "eventId": event.id,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 201

    # MARK: Update Failure

    response = client.post(
        path="/v1/events/event_faqs/",
        data={
            "question": '',
            "answer": '',
            "order": test_order,
            "eventId": event.id,
        },
        headers={"Authorization": f"Token {token}"},
        content_type="application/json",
    )

    assert response.status_code == 400
