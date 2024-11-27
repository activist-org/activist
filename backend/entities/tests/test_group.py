"""
Testing for the Group model.
"""

# mypy: ignore-errors
from datetime import datetime
from uuid import UUID

import pytest
from django.core.exceptions import ValidationError
from faker import Faker

from authentication.factories import UserFactory
from entities.factories import (
    GroupFactory,
    OrganizationFactory,
)
from entities.models import Group

pytestmark = pytest.mark.django_db


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
        terms_checked=True,
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
            category="Test Category",
        )
        group.full_clean()

    # Test missing location
    with pytest.raises(ValidationError):
        group = Group(
            org_id=org,
            created_by=user,
            group_name="Test Group",
            name="Test Name",
            category="Test Category",
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
        category="Test Category",
    )

    # Should not raise ValidationError
    group.full_clean()
    assert group.tagline == ""
    assert group.get_involved_url == ""
    assert group.terms_checked is False


def test_field_max_lengths() -> None:
    """Test that fields have correct max lengths."""
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
        terms_checked=True,
    )

    assert len(group.group_name) <= 100
    assert len(group.name) <= 100
    assert len(group.tagline) <= 200
    assert len(group.location) <= 100
    assert len(group.category) <= 100
    assert len(group.get_involved_url) <= 200


def test_cascade_delete() -> None:
    """Test that deleting an organization deletes all associated groups."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)

    GroupFactory(org_id=org, created_by=user)

    assert Group.objects.count() == 1
    org.delete()
    assert Group.objects.count() == 0

    org = OrganizationFactory(created_by=user)
    GroupFactory(org_id=org, created_by=user)

    assert Group.objects.count() == 1
    user.delete()
    assert Group.objects.count() == 0


def test_url_validations() -> None:
    """Test that get_involved_url field is a valid URL."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    fake = Faker()

    # Test invalid URL
    with pytest.raises(ValidationError):
        group = Group(
            org_id=org,
            created_by=user,
            group_name=fake.company(),
            name=fake.company(),
            location=fake.city(),
            category=fake.word(),
            get_involved_url="not a url",
            terms_checked=True,
        )
        group.full_clean()

    # Test valid URL
    group = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=fake.city(),
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    group.full_clean()


def test_auto_fields() -> None:
    """Test that auto fields are set correctly."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    fake = Faker()

    group = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=fake.city(),
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    assert group.creation_date is not None
    assert isinstance(group.creation_date, datetime)
    assert group.id is not None
    assert isinstance(group.id, UUID)


def test_multiple_groups_per_org() -> None:
    """Test that multiple groups can be created per organization."""
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    fake = Faker()

    group1 = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=fake.city(),
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    group2 = Group.objects.create(
        org_id=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=fake.city(),
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    assert Group.objects.count() == 2
    assert group1.org_id == org
    assert group2.org_id == org

    org_groups = Group.objects.filter(org_id=org)
    assert group1 in org_groups
    assert group2 in org_groups
