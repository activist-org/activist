# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Tests for Organization, Group, and Event FAQs.
"""

from uuid import uuid4

import pytest
from django.utils import timezone
from faker import Faker
from rest_framework import serializers, status
from rest_framework.test import APIClient

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupFaqFactory
from communities.groups.models import Group, GroupFaq
from communities.groups.serializers import GroupFaqSerializer
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
)
from communities.organizations.models import OrganizationFaq
from communities.organizations.serializers import OrganizationFaqSerializer
from content.factories import EntityLocationFactory
from content.models import Faq
from events.factories import EventFactory, EventFaqFactory
from events.models import EventFaq
from events.serializers import EventFaqSerializer


# ---------- Fixtures ----------


@pytest.fixture
def staff_user():
    user = UserFactory(
        username="test_user",
        plaintext_password="test_password",
        is_staff=True,
        verified=True,
        is_confirmed=True,
    )
    return user


@pytest.fixture
def auth_client(staff_user):
    client = APIClient()
    response = client.post(
        "/v1/auth/sign_in",
        {"username": "test_user", "password": "test_password"},
    )
    token = response.json()["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Token {token}")
    return client


# ---------- Model Tests ----------


@pytest.mark.django_db
def test_faq_model_creation():
    faq = Faq.objects.create(
        iso="en", primary=True, question="Question", answer="Answer", order=1
    )

    assert faq.id
    assert faq.primary
    assert faq.question == "Question"
    assert faq.answer == "Answer"
    assert faq.order == 1
    assert str(faq) == "Question"


@pytest.mark.django_db
def test_faq_str_method():
    faq = Faq(
        iso="en",
        primary=True,
        question="Test Question?",
        answer="Test Answer",
        order=1,
        last_updated=timezone.now(),
    )
    assert str(faq) == faq.question


# ---------- Serializer Tests ----------


@pytest.mark.parametrize(
    "serializer_class, model_class",
    [
        (OrganizationFaqSerializer, OrganizationFaq),
        (GroupFaqSerializer, GroupFaq),
        (EventFaqSerializer, EventFaq),
    ],
)
@pytest.mark.django_db
def test_faq_serializers(serializer_class, model_class):
    faq = model_class(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Question",
        answer="Answer",
        order=1,
        last_updated=timezone.now(),
    )

    data = serializer_class(faq).data

    assert data["iso"] == "en"
    assert data["primary"] is True
    assert data["question"] == "Question"
    assert data["answer"] == "Answer"
    assert data["order"] == 1


@pytest.mark.django_db
def test_validate_group_accepts_instance():
    fake = Faker()
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()

    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=location,
        category=fake.word(),
        terms_checked=True,
    )

    serializer = GroupFaqSerializer()
    assert serializer.validate_group(group) == group


@pytest.mark.django_db
def test_validate_group_invalid_uuid():
    serializer = GroupFaqSerializer()
    with pytest.raises(serializers.ValidationError, match="Group not found."):
        serializer.validate_group(uuid4())


@pytest.mark.django_db
def test_validate_event_uuid_and_instance():
    event = EventFactory()
    serializer = EventFaqSerializer()

    assert serializer.validate_event(event) == event
    assert serializer.validate_event(event.id) == event
    assert serializer.validate_event(str(event.id)) == event


@pytest.mark.django_db
def test_validate_event_not_found():
    serializer = EventFaqSerializer()
    with pytest.raises(serializers.ValidationError, match="Event not found."):
        serializer.validate_event(uuid4())


# ---------- View Tests (List) ----------


@pytest.mark.django_db
@pytest.mark.parametrize(
    "factory, url",
    [
        (OrganizationFaqFactory, "/v1/communities/organizations/{id}"),
        (GroupFaqFactory, "/v1/communities/groups/{id}"),
        (EventFaqFactory, "/v1/events/events/{id}"),
    ],
)
def test_faq_list_views(client, factory, url):
    parent = factory._meta.model._meta.get_field("org").model() \
        if "org" in factory._meta.model._meta.fields_map else None

    if factory == OrganizationFaqFactory:
        parent = OrganizationFactory()
        factory.create_batch(3, org=parent)
    elif factory == GroupFaqFactory:
        parent = GroupFactory()
        factory.create_batch(3, group=parent)
    else:
        parent = EventFactory()
        factory.create_batch(3, event=parent)

    response = client.get(url.format(id=parent.id))
    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()["faqEntries"]) == 3


# ---------- View Tests (Update via PUT) ----------


@pytest.mark.django_db
@pytest.mark.parametrize(
    "factory, url, model",
    [
        (OrganizationFaqFactory, "/v1/communities/organization_faqs/{id}", OrganizationFaq),
        (GroupFaqFactory, "/v1/communities/group_faqs/{id}", GroupFaq),
        (EventFaqFactory, "/v1/events/event_faqs/{id}", EventFaq),
    ],
)
def test_faq_update_views(auth_client, staff_user, factory, url, model):
    if factory == OrganizationFaqFactory:
        parent = OrganizationFactory(created_by=staff_user)
        faq = factory(org=parent)
    elif factory == GroupFaqFactory:
        parent = GroupFactory(created_by=staff_user)
        faq = factory(group=parent)
    else:
        parent = EventFactory(created_by=staff_user)
        faq = factory(event=parent)

    response = auth_client.put(
        url.format(id=faq.id),
        {
            "id": faq.id,
            "iso": "en",
            "primary": True,
            "question": "Updated Question",
            "answer": "Answer",
            "order": 1,
        },
        content_type="application/json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert model.objects.get(id=faq.id).question == "Updated Question"
