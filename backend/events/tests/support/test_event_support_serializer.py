# SPDX-License-Identifier: AGPL-3.0-or-later
import pytest
from rest_framework import serializers

from authentication.factories import UserFactory
from events.factories import EventFactory
from events.models import EventSupport
from events.serializers import EventSupportSerializer

pytestmark = pytest.mark.django_db


def test_event_support_serializer_fields_are_read_only():
    serializer = EventSupportSerializer()

    assert serializer.fields["event"].read_only is True
    assert serializer.fields["supporter_user"].read_only is True
    assert serializer.fields["creation_date"].read_only is True


def test_event_support_serializer_validate_event_returns_existing_event():
    event = EventFactory()
    serializer = EventSupportSerializer()

    assert serializer.validate_event(event.id) == event
    assert serializer.validate_event(event) == event


def test_event_support_serializer_validate_event_rejects_missing_event():
    serializer = EventSupportSerializer()

    with pytest.raises(serializers.ValidationError, match="Event not found."):
        serializer.validate_event("00000000-0000-0000-0000-000000000000")


def test_event_support_serializer_create():
    event = EventFactory()
    user = UserFactory()

    support = EventSupportSerializer().create({"event": event, "supporter_user": user})

    assert support.event == event
    assert support.supporter_user == user
    assert EventSupport.objects.filter(id=support.id).exists()
