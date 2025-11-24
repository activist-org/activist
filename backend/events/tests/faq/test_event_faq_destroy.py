# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for the event FAQ destroy methods.
"""

from uuid import uuid4

import pytest

from events.factories import EventFactory, EventFaqFactory
from events.models import EventFaq

pytestmark = pytest.mark.django_db

# MARK: Destroy


def test_event_faq_destroy_success(authenticated_client) -> None:
    """
    Test successful Event FAQ deletion by the creator.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the Django test client and the authenticated user.

    Returns
    -------
    None
        This test asserts that the FAQ is deleted successfully (status 204)
        and that the FAQ no longer exists in the database.
    """
    client, user = authenticated_client

    event = EventFactory(created_by=user)
    faq = EventFaqFactory(event=event)
    test_id = faq.id

    response = client.delete(
        path=f"/v1/events/event_faqs/{test_id}",
        content_type="application/json",
    )

    assert response.status_code == 204
    assert response.data["message"] == "FAQ deleted successfully."

    # Verify the FAQ was actually deleted from the database
    assert not EventFaq.objects.filter(id=test_id).exists()


def test_event_faq_destroy_by_staff(authenticated_client) -> None:
    """
    Test successful Event FAQ deletion by a staff member.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the Django test client and the authenticated user.

    Returns
    -------
    None
        This test asserts that staff members can delete any FAQ (status 204).
    """
    client, user = authenticated_client
    user.is_staff = True
    user.save()

    # Create an event with a different creator
    other_event = EventFactory()
    faq = EventFaqFactory(event=other_event)
    test_id = faq.id

    response = client.delete(
        path=f"/v1/events/event_faqs/{test_id}",
        content_type="application/json",
    )

    assert response.status_code == 204
    assert response.data["message"] == "FAQ deleted successfully."

    # Verify the FAQ was actually deleted from the database
    assert not EventFaq.objects.filter(id=test_id).exists()


def test_event_faq_destroy_not_found(authenticated_client) -> None:
    """
    Test Event FAQ deletion with non-existent FAQ ID.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the Django test client and the authenticated user.

    Returns
    -------
    None
        This test asserts that attempting to delete a non-existent FAQ
        returns a 404 status code with appropriate error message.
    """
    client, _ = authenticated_client

    test_uuid = uuid4()

    response = client.delete(
        path=f"/v1/events/event_faqs/{test_uuid}",
        content_type="application/json",
    )

    assert response.status_code == 404
    assert response.data["detail"] == "FAQ not found."


def test_event_faq_destroy_not_authorized(authenticated_client) -> None:
    """
    Test Event FAQ deletion by unauthorized user.

    Parameters
    ----------
    authenticated_client : tuple
        A tuple containing the Django test client and the authenticated user.

    Returns
    -------
    None
        This test asserts that users who are neither the creator nor staff
        cannot delete a FAQ (status 403).
    """
    client, user = authenticated_client
    user.is_staff = False
    user.save()

    # Create an event with a different creator
    other_event = EventFactory()
    faq = EventFaqFactory(event=other_event)
    test_id = faq.id

    response = client.delete(
        path=f"/v1/events/event_faqs/{test_id}",
        content_type="application/json",
    )

    assert response.status_code == 403
    assert response.data["detail"] == "You are not authorized to delete this FAQ."

    # Verify the FAQ still exists in the database
    assert EventFaq.objects.filter(id=test_id).exists()
