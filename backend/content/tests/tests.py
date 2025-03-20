# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Testing for the content app.
"""

# mypy: ignore-errors
import pytest
from uuid import uuid4
from django.utils import timezone

from content.factories import ResourceFactory, TaskFactory, TopicFactory
from content.models import (
    Discussion,
    Faq,
    Image,
    Location,
    SocialLink,
    Tag,
    DiscussionEntry
)
from authentication.factories import UserFactory
from unittest.mock import patch

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    resource = ResourceFactory.build()
    task = TaskFactory.build()
    topics = TopicFactory.build()

    assert str(resource) == resource.name
    assert str(task) == task.name
    assert str(topics) == topics.name


def test_discussion_str_method():
    """Test the __str__ method of the Discussion model."""
    user = UserFactory()
    discussion = Discussion(
        id=uuid4(),
        created_by=user,
        title="Test Discussion",
        creation_date=timezone.now()
    )
    assert str(discussion) == f"{discussion.id}"


def test_faq_str_method():
    """Test the __str__ method of the Faq model."""
    faq = Faq(
        id=uuid4(),
        iso="en",
        primary=True,
        question="Test Question?",
        answer="Test Answer",
        order=1,
        last_updated=timezone.now()
    )
    assert str(faq) == faq.question


def test_image_str_method():
    """Test the __str__ method of the Image model."""
    image_id = uuid4()
    image = Image(
        id=image_id,
        creation_date=timezone.now()
    )
    assert str(image) == f"{image_id}"


def test_location_str_method():
    """Test the __str__ method of the Location model."""
    location_id = uuid4()
    location = Location(
        id=location_id,
        lat="40.7128",
        lon="-74.0060",
        display_name="New York City"
    )
    assert str(location) == f"{location_id}"


def test_social_link_str_method():
    """Test the __str__ method of the SocialLink model."""
    social_link = SocialLink(
        id=uuid4(),
        link="https://example.com",
        label="Example",
        order=1,
        creation_date=timezone.now(),
        last_updated=timezone.now()
    )
    assert str(social_link) == social_link.label


def test_tag_str_method():
    """Test the __str__ method of the Tag model."""
    tag_id = uuid4()
    tag = Tag(
        id=tag_id,
        text="Test Tag",
        description="Test Description",
        creation_date=timezone.now()
    )
    assert str(tag) == f"{tag_id}"


def test_discussion_entry_str_method():
    """Test the __str__ method of the DiscussionEntry model."""
    user = UserFactory()
    discussion = Discussion(
        id=uuid4(),
        created_by=user,
        title="Test Discussion",
        creation_date=timezone.now()
    )
    discussion.save()

    entry_id = uuid4()
    entry = DiscussionEntry(
        id=entry_id,
        discussion=discussion,
        created_by=user,
        text="Test Entry",
        creation_date=timezone.now(),
        last_updated=timezone.now()
    )
    assert str(entry) == f"{entry_id}"


@patch("content.signals.cache.keys")
@patch("content.signals.cache.delete_many")
def test_invalidate_resource_cache(mock_keys, mock_delete_many) -> None:
    resource = ResourceFactory.create()
    resource.save()

    mock_keys.assert_called()
    mock_delete_many.assert_called()
