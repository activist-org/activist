# SPDX-License-Identifier: AGPL-3.0-or-later

import uuid
from datetime import datetime
from uuid import uuid4

import pytest
from rest_framework import serializers

from authentication.factories import UserFactory
from content.factories import EntityLocationFactory
from events.factories import EventFactory
from events.models import EventResource
from events.serializers import EventResourceSerializer


@pytest.mark.django_db
def test_event_resource_serializer_serialization() -> None:
    """
    Test serialization of EventResource model data.
    """
    # Create required dependencies.
    user = UserFactory()
    location = EntityLocationFactory()
    event = EventFactory()

    # Create EventResource instance.
    event_resource = EventResource.objects.create(
        created_by=user,
        name="Test Resource",
        description="Resource description",
        url="https://example.com",
        order=1,
        location=location,
        event=event,
        is_private=False,
        terms_checked=True,
    )

    # Serialize and validate output.
    serializer = EventResourceSerializer(event_resource)
    data = serializer.data

    assert data["name"] == "Test Resource"
    assert data["description"] == "Resource description"
    assert data["url"] == "https://example.com"
    assert data["order"] == 1
    assert data["is_private"] is False
    assert data["terms_checked"] is True

    # FIX: Compare UUID objects directly (not string to UUID).
    assert data["event"] == event.id
    assert data["id"] == str(event_resource.id)
    assert datetime.fromisoformat(data["creation_date"]).tzinfo is not None
    assert datetime.fromisoformat(data["last_updated"]).tzinfo is not None


@pytest.mark.django_db
def test_validate_event_with_event_instance() -> None:
    """
    Should return the same event when an Event instance is passed.
    """
    event = EventFactory()
    serializer = EventResourceSerializer()

    result = serializer.validate_event(event)
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_valid_uuid() -> None:
    """
    Should fetch and return the event when a valid UUID is given.
    """
    event = EventFactory()
    serializer = EventResourceSerializer()

    result = serializer.validate_event(event.id)
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_valid_uuid_string() -> None:
    """
    Should fetch and return the event when a valid UUID string is given.
    """
    event = EventFactory()
    serializer = EventResourceSerializer()

    result = serializer.validate_event(str(event.id))
    assert result == event


@pytest.mark.django_db
def test_validate_event_with_invalid_uuid() -> None:
    """
    Should raise ValidationError when event does not exist.
    """
    serializer = EventResourceSerializer()
    invalid_uuid = uuid.uuid4()

    with pytest.raises(serializers.ValidationError) as exc_info:
        serializer.validate_event(invalid_uuid)

    assert "Event not found." in str(exc_info.value)


@pytest.mark.django_db
def test_validate_event_with_invalid_uuid_string() -> None:
    """
    Should raise ValidationError when a valid UUID format but non-existent event is provided.
    """
    serializer = EventResourceSerializer()
    non_existent_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Event not found."):
        serializer.validate_event(non_existent_uuid)
