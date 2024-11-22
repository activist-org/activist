"""
Testing for the entities app.
"""

# mypy: ignore-errors
from uuid import uuid4
import pytest

from entities.factories import (
    OrganizationFactory,
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
from .models import Group
from django.test import Client
from faker import Faker

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


def test_group_str_method() -> None:
    """Test the __str__ method of the Group model."""
    group = GroupFactory.build()
    assert str(group) == group.name


def test_group_creation(client: Client) -> None:
    """
    Test Group creation.

    Scenarios:
    1. Successfully create a group with required fields.
    2. Attempt creation with missing required fields.
    3. Attempt creation with invalid data.
    """
    # Setup
    fake = Faker()
    organization = OrganizationFactory.create()
    user = UserFactory.create()

    # 1. Successfully create a group with required fields
    response = client.post(
        path="/v1/groups/create/",
        data={
            "group_name": "Environmental Club",
            "name": fake.company(),
            "org_id": organization.id,
            "location": "City Hall",
            "created_by": user.id,
            "category": "Environment",
            "terms_checked": True,
        },
    )
    assert response.status_code == 201
    assert Group.objects.filter(group_name="Environmental Club").exists()

    # 2. Attempt creation with missing required fields (e.g., name)
    response = client.post(
        path="/v1/groups/create/",
        data={
            "group_name": "Science Club",
            "org_id": organization.id,
            "location": "Museum",
            "created_by": user.id,
            "category": "Science",
            "terms_checked": True,
        },
    )
    assert response.status_code == 400
    assert not Group.objects.filter(group_name="Science Club").exists()

    # 3. Attempt creation with invalid data (e.g., invalid URL)
    response = client.post(
        path="/v1/groups/create/",
        data={
            "group_name": "Adventure Club",
            "name": fake.company(),
            "org_id": organization.id,
            "location": "National Park",
            "created_by": user.id,
            "category": "Adventure",
            "terms_checked": True,
            "get_involved_url": "not_a_valid_url",
        },
    )
    assert response.status_code == 400
    assert not Group.objects.filter(group_name="Adventure Club").exists()


def test_group_update(client: Client) -> None:
    """
    Test Group update.

    Scenarios:
    1. Successfully update a group.
    2. Attempt to update with invalid data.
    """
    # Setup
    group = GroupFactory.create()
    new_location = "Community Center"
    new_category = "Community"

    # 1. Successfully update a group
    response = client.patch(
        path=f"/v1/groups/{group.id}/",
        data={"location": new_location, "category": new_category},
        content_type="application/json",
    )
    assert response.status_code == 200
    group.refresh_from_db()
    assert group.location == new_location
    assert group.category == new_category

    # 2. Attempt to update with invalid data (e.g., invalid URL)
    response = client.patch(
        path=f"/v1/groups/{group.id}/",
        data={"get_involved_url": "invalid_url"},
        content_type="application/json",
    )
    assert response.status_code == 400


def test_group_deletion(client: Client) -> None:
    """
    Test Group deletion.

    Scenarios:
    1. Successfully delete an existing group.
    2. Attempt to delete a non-existing group.
    """
    # Setup
    group = GroupFactory.create()

    # 1. Successfully delete an existing group
    response = client.delete(path=f"/v1/groups/{group.id}/")
    assert response.status_code == 204
    assert not Group.objects.filter(id=group.id).exists()

    # 2. Attempt to delete a non-existing group
    response = client.delete(path=f"/v1/groups/{uuid4()}/")
    assert response.status_code == 404
