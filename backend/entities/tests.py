"""
Testing for the entities app.
"""

# mypy: ignore-errors
import pytest
from django.test import TestCase, Client
from django.core.exceptions import ValidationError
from django.utils import timezone
from uuid import UUID
from datetime import datetime
from faker import Faker
from django.contrib.auth import get_user_model

from .models import (
    Group,
    Organization
)

from .factories import (
    OrganizationFactory,
    OrganizationApplicationFactory,
    OrganizationEventFactory,
    OrganizationMemberFactory,
    OrganizationResourceFactory,
    GroupFactory,
    OrganizationTaskFactory,
    OrganizationTopicFactory,
    GroupEventFactory,
    GroupMemberFactory,
    GroupResourceFactory,
    GroupTopicFactory,
)

from authentication.factories import UserFactory

pytestmark = pytest.mark.django_db


def test_str_methods() -> None:
    organization = OrganizationFactory.create()
    # Note: Needs to be updated to reflect the recent changes.
    # organization_application = OrganizationApplicationFactory.create()
    organization_event = OrganizationEventFactory.create()
    organization_member = OrganizationMemberFactory.create()
    organization_resource = OrganizationResourceFactory.create()
    organization_task = OrganizationTaskFactory.create()
    organization_topic = OrganizationTopicFactory.create()

    group = GroupFactory.create()
    group_event = GroupEventFactory.create()
    group_member = GroupMemberFactory.create()
    group_resource = GroupResourceFactory.create()
    group_topic = GroupTopicFactory.create()

    assert str(organization) == organization.name
    # assert str(organization_application) == str(organization_application.creation_date)
    assert str(organization_event) == str(organization_event.id)
    assert str(organization_member) == str(organization_member.id)
    assert str(organization_resource) == str(organization_resource.id)
    assert str(organization_task) == str(organization_task.id)
    assert str(organization_topic) == str(organization_topic.id)

    assert str(group) == group.name
    assert str(group_event) == str(group_event.id)
    assert str(group_member) == str(group_member.id)
    assert str(group_resource) == str(group_resource.id)
    assert str(group_topic) == str(group_topic.id)

def test_group_creation() -> None:
    """Test complete group creation with all fields."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    fake = Faker()
    
    group = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=fake.city(),
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True
    )

    assert isinstance(group.id, UUID)
    assert group.org_id == org
    assert group.created_by == user
    assert isinstance(group.group_name, str)
    assert isinstance(group.creation_date, datetime)
    assert group.terms_checked is True

def test_required_fields() -> None:
    """Test that required fields raise validation error when missing."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)

    # Test missing group_name
    with pytest.raises(ValidationError):
        group = Group(
            org_id=org,
            created_by=user,
            name="Test Name",
            location="Test Location",
            category="Test Category"
        )
        group.full_clean()

    # Test missing location
    with pytest.raises(ValidationError):
        group = Group(
            org_id=org,
            created_by=user,
            group_name="Test Group",
            name="Test Name",
            category="Test Category"
        )
        group.full_clean()

def test_optional_fields() -> None:
    """Test that optional fields can be blank or null."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    
    group = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name="Test Group",
        name="Test Name",
        location="Test Location",
        category="Test Category"
    )
    
    group.full_clean()  # Should not raise ValidationError
    assert group.tagline == ""
    assert group.get_involved_url == ""
    assert group.terms_checked is False

