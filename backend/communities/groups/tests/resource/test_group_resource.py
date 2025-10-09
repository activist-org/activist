# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test cases for GroupResource model.
"""

from uuid import uuid4

import pytest
from faker import Faker
from rest_framework import serializers

from authentication.factories import UserFactory
from communities.groups.factories import GroupFactory, GroupResourceFactory
from communities.groups.models import Group, GroupResource
from communities.groups.serializers import GroupResourceSerializer
from communities.organizations.factories import OrganizationFactory
from content.factories import EntityLocationFactory

pytestmark = pytest.mark.django_db


def test_group_resource_multiple_resources() -> None:
    """
    Test multiple resources for a single group.
    """
    group = GroupFactory()
    resources = [GroupResourceFactory(group=group) for _ in range(3)]

    group.resources.set(resources)

    assert len(resources) == 3

    for resource in resources:
        assert resource in group.resources.all()


# MARK: Serializers


@pytest.mark.django_db
def test_group_resource_serializer() -> None:
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()

    # Create VALID Group with ALL required fields.
    group = Group.objects.create(
        id=uuid4(),
        org=org,
        created_by=user,
        name="Test Group",
        group_name="Test Group",
        tagline="Test tagline",
        location=location,
        category="test",
        get_involved_url="http://example.com",
        terms_checked=True,
    )

    resource = GroupResource.objects.create(
        id=uuid4(),
        created_by=user,
        name="Test Resource",
        description="A useful resource",
        url="http://example.com",
        order=1,
        category="general",
        location=location,
        is_private=False,
        terms_checked=True,
        group=group,
    )

    serializer = GroupResourceSerializer(resource)
    data = serializer.data

    assert data["name"] == "Test Resource"
    assert data["description"] == "A useful resource"
    assert data["url"] == "http://example.com"
    assert data["order"] == 1
    assert data["category"] == "general"
    assert data["is_private"] is False
    assert data["terms_checked"] is True


@pytest.mark.django_db
def test_validate_group_with_group_instance_resource_serializer():
    """
    Should return the same group when a Group instance is passed.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    serializer = GroupResourceSerializer()
    result = serializer.validate_group(group)
    assert result == group


@pytest.mark.django_db
def test_validate_group_with_valid_uuid_resource_serializer():
    """
    Should fetch and return the group when a valid UUID is given.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        tagline=fake.catch_phrase(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    serializer = GroupResourceSerializer()
    result = serializer.validate_group(group.id)
    assert result == group


@pytest.mark.django_db
def test_validate_group_with_invalid_uuid_resource_serializer():
    """
    Should raise ValidationError when group does not exist.
    """
    group_faq_serializer = GroupResourceSerializer()
    fake_uuid = uuid4()

    with pytest.raises(serializers.ValidationError, match="Group not found."):
        group_faq_serializer.validate_group(fake_uuid)
