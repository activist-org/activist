# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for Organization, Group, and Event FAQs.
"""

from uuid import uuid4

import pytest
from django.utils import timezone
from django.utils.timezone import now
from rest_framework import status
from rest_framework.test import APIClient

from communities.groups.factories import GroupFactory, GroupFaqFactory
from communities.groups.models import GroupFaq
from communities.groups.serializers import GroupFaqSerializer
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)
from communities.organizations.models import OrganizationFaq
from communities.organizations.serializers import OrganizationFaqSerializer
from content.models import Faq
from events.factories import EventFactory, EventFaqFactory
from events.models import EventFaq
from events.serializers import EventFaqSerializer

# MARK: FAQ Model


@pytest.mark.django_db
def test_create_faq() -> None:
    """
    Test the creation of a FAQ from its model.
    """
    faq = Faq.objects.create(
        iso="en", primary=True, question="Question", answer="Answer", order=1
    )

    assert faq.id is not None
    assert faq.primary
    assert faq.question is not None
    assert faq.answer is not None
    assert faq.order is not None
    assert str(faq) == "Question"


# MARK: Serializers


@pytest.mark.django_db
def test_organization_faq_serializer() -> None:
    """
    Test the serializer of an organization FAQ.
    """
    faq = OrganizationFaq(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Question",
        answer="Answer",
        order=1,
        last_updated=now(),
    )
    serializer = OrganizationFaqSerializer(faq)
    data = serializer.data

    assert data["iso"] == "en"
    assert data["primary"]
    assert data["question"] == "Question"
    assert data["answer"] == "Answer"
    assert data["order"] == 1


@pytest.mark.django_db
def test_group_faq_serializer() -> None:
    """
    Test the serializer of a group FAQ.
    """
    faq = GroupFaq(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Question",
        answer="Answer",
        order=1,
        last_updated=now(),
    )
    serializer = GroupFaqSerializer(faq)
    data = serializer.data

    assert data["iso"] == "en"
    assert data["primary"]
    assert data["question"] == "Question"
    assert data["answer"] == "Answer"
    assert data["order"] == 1


@pytest.mark.django_db
def test_event_faq_serializer() -> None:
    """
    Test the serializer of an event FAQ.
    """
    faq = EventFaq(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Question",
        answer="Answer",
        order=1,
        last_updated=now(),
    )
    serializer = EventFaqSerializer(faq)
    data = serializer.data

    assert data["iso"] == "en"
    assert data["primary"]
    assert data["question"] == "Question"
    assert data["answer"] == "Answer"
    assert data["order"] == 1


# MARK: Views - List


@pytest.mark.django_db
def test_organization_faq_list_view(client: APIClient) -> None:
    """
    Test the listing of FAQs for an organization.
    This is like a GET request.
    """
    org = OrganizationFactory()
    num_faqs = 3
    OrganizationFaqFactory.create_batch(num_faqs, org=org)

    response = client.get(f"/v1/communities/organizations/{org.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["faqEntries"]) == num_faqs


@pytest.mark.django_db
def test_group_faq_list_view(client: APIClient) -> None:
    """
    Test the listing of FAQs for a group.
    This is like a GET request.
    """
    group = GroupFactory()
    num_faqs = 3
    GroupFaqFactory.create_batch(num_faqs, group=group)

    response = client.get(f"/v1/communities/groups/{group.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["faqEntries"]) == num_faqs


@pytest.mark.django_db
def test_event_faq_list_view(client: APIClient) -> None:
    """
    Test the listing of FAQs for an event.
    This is like a GET request.
    """
    event = EventFactory()
    num_faqs = 3
    EventFaqFactory.create_batch(num_faqs, event=event)

    response = client.get(f"/v1/events/events/{event.id}")

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["faqEntries"]) == num_faqs


# MARK: Views - Create


@pytest.mark.django_db
def test_organization_faq_create_view(client: APIClient) -> None:
    """
    Test the creation of FAQs for an organization.
    The API uses PUT method instead of POST.
    """
    org = OrganizationFactory()
    num_faqs = 3
    OrganizationFaqFactory.create_batch(num_faqs, org=org)
    assert OrganizationFaq.objects.count() == num_faqs

    test_id = OrganizationFaq.objects.first().id
    formData = {
        "id": test_id,
        "iso": "en",
        "primary": True,
        "question": "Test Question",
        "answer": "Answer",
        "order": 1,
    }

    response = client.put(
        f"/v1/communities/organization_faqs/{org.id}",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK

    assert OrganizationFaq.objects.get(id=test_id).question == "Test Question"


@pytest.mark.django_db
def test_group_faq_create_view(client: APIClient) -> None:
    """
    Test the creation of FAQs for a group.
    The API uses PUT method instead of POST.
    """
    group = GroupFactory()
    num_faqs = 3
    GroupFaqFactory.create_batch(num_faqs, group=group)
    assert GroupFaq.objects.count() == num_faqs

    test_id = GroupFaq.objects.first().id
    formData = {
        "id": test_id,
        "iso": "en",
        "primary": True,
        "question": "Test Question",
        "answer": "Answer",
        "order": 1,
    }

    response = client.put(
        f"/v1/communities/group_faqs/{group.id}",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    assert GroupFaq.objects.get(id=test_id).question == "Test Question"


@pytest.mark.django_db
def test_event_faq_create_view(client: APIClient) -> None:
    """
    Test the creation of FAQs for an event.
    The API uses PUT method instead of POST.
    """
    event = EventFactory()
    num_faqs = 3
    EventFaqFactory.create_batch(num_faqs, event=event)
    assert EventFaq.objects.count() == num_faqs

    test_id = EventFaq.objects.first().id
    formData = {
        "id": test_id,
        "iso": "en",
        "primary": True,
        "question": "Test Question",
        "answer": "Answer",
        "order": 1,
    }

    response = client.put(
        f"/v1/events/event_faqs/{event.id}",
        formData,
        content_type="application/json",
    )

    # PUT in this case returns 200 OK instead of 201 Created.
    assert response.status_code == status.HTTP_200_OK
    assert EventFaq.objects.get(id=test_id).question == "Test Question"


def test_faq_str_method():
    """
    Test the __str__ method of the Faq model.
    """
    faq = Faq(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Test Question?",
        answer="Test Answer",
        order=1,
        last_updated=timezone.now(),
    )
    assert str(faq) == faq.question
