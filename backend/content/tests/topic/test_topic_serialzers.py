# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for topic Serialzers.
"""

from datetime import timedelta
from unittest.mock import patch

import pytest
from django.utils import timezone
from rest_framework import serializers

from content.serializers import TopicSerializer

# MARK: Tests for TopicSerializer


@pytest.mark.django_db
def test_topic_serializer_valid_active_topic():
    """
    Test validation of an active topic with no deprecation date (valid case).
    """
    # Create valid active topic data
    data = {
        "name": "Technology",
        "description": "All about technology",
        "active": True,
        # No deprecation_date for active topic
    }

    serializer = TopicSerializer(data=data)
    assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"
    assert serializer.validated_data["active"] is True
    assert (
        "deprecation_date" not in serializer.validated_data
        or serializer.validated_data["deprecation_date"] is None
    )


@pytest.mark.django_db
def test_topic_serializer_active_with_deprecation_date():
    """
    Test validation fails when active topic has a deprecation date.
    """
    # Create invalid active topic with deprecation date
    data = {
        "name": "Technology",
        "description": "All about technology",
        "active": True,
        "deprecation_date": timezone.now() + timedelta(days=30),
    }

    serializer = TopicSerializer(data=data)
    assert not serializer.is_valid()
    assert "non_field_errors" in serializer.errors
    assert "Active topics cannot have a deprecation date." in str(
        serializer.errors["non_field_errors"]
    )
    assert (
        serializer.errors["non_field_errors"][0].code
        == "active_topic_with_deprecation_error"
    )


# TODO Write Test validation of an inactive topic with deprecation date (valid case).


@pytest.mark.django_db
def test_topic_serializer_inactive_without_deprecation_date():
    """
    Test validation fails when inactive topic lacks deprecation date.
    """
    # Create invalid inactive topic without deprecation date
    data = {
        "name": "Old Technology",
        "description": "Deprecated technology topics",
        "active": False,
        # Missing deprecation_date for inactive topic
    }

    serializer = TopicSerializer(data=data)
    assert not serializer.is_valid()
    assert "non_field_errors" in serializer.errors
    assert "Deprecated topics must have a deprecation date." in str(
        serializer.errors["non_field_errors"]
    )
    assert (
        serializer.errors["non_field_errors"][0].code
        == "inactive_topic_no_deprecation_error"
    )


@pytest.mark.django_db
def test_topic_serializer_creation_date_after_deprecation_date():
    """
    Test validation fails when creation date is after deprecation date.
    """
    # Mock validate_creation_and_deprecation_dates to raise error
    with patch(
        "content.serializers.validate_creation_and_deprecation_dates"
    ) as mock_validate:
        mock_validate.side_effect = serializers.ValidationError(
            "Creation date cannot be after deprecation date."
        )

        data = {
            "name": "Test Topic",
            "description": "Test description",
            "active": False,
            "deprecation_date": timezone.now() - timedelta(days=1),
        }

        serializer = TopicSerializer(data=data)
        assert not serializer.is_valid()
        assert "non_field_errors" in serializer.errors
        assert "Creation date cannot be after deprecation date." in str(
            serializer.errors["non_field_errors"]
        )


@pytest.mark.django_db
def test_topic_serializer_valid_dates():
    """
    Test validation succeeds with valid creation and deprecation dates.
    """
    # Mock validate_creation_and_deprecation_dates to do nothing (success)
    with patch(
        "content.serializers.validate_creation_and_deprecation_dates"
    ) as mock_validate:
        mock_validate.return_value = None

        data = {
            "name": "Test Topic",
            "description": "Test description",
            "active": False,
            "deprecation_date": timezone.now() - timedelta(days=1),
        }

        serializer = TopicSerializer(data=data)
        assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"
        # The key fix: creation_date is NOT in the data passed to validation
        expected_data = {
            "name": "Test Topic",
            "description": "Test description",
            "active": False,
            "deprecation_date": data["deprecation_date"],
        }
        mock_validate.assert_called_once_with(expected_data)


@pytest.mark.django_db
def test_topic_serializer_create():
    """
    Test creating a topic through the serializer.
    """
    data = {
        "name": "New Topic",
        "description": "Brand new topic",
        "active": True,
    }

    serializer = TopicSerializer(data=data)
    assert serializer.is_valid(), f"Serializer errors: {serializer.errors}"

    topic = serializer.save()
    assert topic.name == "New Topic"
    assert topic.description == "Brand new topic"
    assert topic.active is True
    assert topic.deprecation_date is None


# TODO write test for update method of TopicSerializer if needed
