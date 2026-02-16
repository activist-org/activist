# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test to check the numbers of entities (groups, organizations and events) and content (faqs, resources and social links)
created by the populate_db command.
"""

from pathlib import Path

import pytest
from django.core.management import call_command

from authentication.models import UserModel
from communities.groups.models import Group, GroupFaq, GroupResource, GroupSocialLink
from communities.organizations.models import (
    Organization,
    OrganizationFaq,
    OrganizationResource,
    OrganizationSocialLink,
)
from events.models import Event, EventFaq, EventResource, EventSocialLink


@pytest.mark.django_db
def test_populate_db_command_with_arguments():
    """
    Test that the populate_db command creates the expected number of entities and content.
    """
    call_command("flush", "--noinput")
    call_command("loaddata", "fixtures/topics.json")

    call_command(
        "populate_db",
        users=2,
        orgs_per_user=1,
        groups_per_org=1,
        events_per_org=1,
        events_per_group=1,
        resources_per_entity=1,
        faq_entries_per_entity=1,
        json_data_to_assign="",
    )

    assert UserModel.objects.count() == 2

    # Entities

    assert Organization.objects.count() == 2
    assert Group.objects.count() == 2
    assert Event.objects.count() == 4

    # Content

    assert OrganizationResource.objects.count() == 2
    assert GroupResource.objects.count() == 2
    assert EventResource.objects.count() == 4

    assert OrganizationFaq.objects.count() == 2
    assert GroupFaq.objects.count() == 2
    assert EventFaq.objects.count() == 4

    assert OrganizationSocialLink.objects.count() == 6
    assert GroupSocialLink.objects.count() == 6
    assert EventSocialLink.objects.count() == 12


@pytest.mark.django_db
def test_populate_db_command_zero_users():
    """
    Test that the populate_db command handles zero users correctly.
    """
    call_command("populate_db", users=0)
    assert UserModel.objects.count() == 0

    # Entities

    assert Organization.objects.count() == 0
    assert Group.objects.count() == 0
    assert Event.objects.count() == 0

    # Content

    assert OrganizationResource.objects.count() == 0
    assert EventResource.objects.count() == 0
    assert GroupResource.objects.count() == 0

    assert OrganizationFaq.objects.count() == 0
    assert EventFaq.objects.count() == 0
    assert GroupFaq.objects.count() == 0

    assert OrganizationSocialLink.objects.count() == 0
    assert GroupSocialLink.objects.count() == 0
    assert EventSocialLink.objects.count() == 0


@pytest.mark.django_db
def test_populate_db_command_with_nondefault_arguments():
    """
    Test that the populate_db command creates the expected number of entities and content for arbitrary and large input numbers.
    """
    call_command("flush", "--noinput")
    call_command("loaddata", "fixtures/topics.json")

    call_command(
        "populate_db",
        users=1,
        orgs_per_user=2,
        groups_per_org=2,
        events_per_org=2,
        events_per_group=2,
        resources_per_entity=2,
        faq_entries_per_entity=2,
        json_data_to_assign="",
    )
    assert UserModel.objects.count() == 1

    # Entities

    assert Organization.objects.count() == 2  # users * orgs_per_user
    assert Group.objects.count() == 4  # orgs * groups_per_org
    assert Event.objects.count() == 12  # orgs*events_per_org + groups*events_per_group

    # Content

    assert OrganizationResource.objects.count() == 4  # orgs * resources_per_entity
    assert GroupResource.objects.count() == 8  # groups * resources_per_entity
    assert EventResource.objects.count() == 24  # events * resources_per_entity

    assert OrganizationFaq.objects.count() == 4  # orgs * faq_entries_per_entity
    assert GroupFaq.objects.count() == 8  # groups * faq_entries_per_entity
    assert EventFaq.objects.count() == 24  # events * faq_entries_per_entity

    assert OrganizationSocialLink.objects.count() == 6  # orgs * 3
    assert GroupSocialLink.objects.count() == 12  # groups * 3
    assert EventSocialLink.objects.count() == 36  # events * 3


@pytest.mark.django_db
def test_populate_db_command_with_preexisting_users():
    """
    Test that the populate_db command correctly handles preexisting users.
    """
    call_command("flush", "--noinput")
    call_command("loaddata", "fixtures/topics.json")

    user1 = UserModel.objects.create(username="normal1")
    user1.set_unusable_password()
    user1.save()

    user2 = UserModel.objects.create(username="normal2")
    user2.set_unusable_password()
    user2.save()

    admin = UserModel.objects.create(
        username="admin",
        is_staff=True,
        is_superuser=True,
    )
    admin.set_unusable_password()
    admin.save()

    call_command("populate_db", users=2)
    assert UserModel.objects.count() == 3
    assert UserModel.objects.filter(username="normal1").count() == 0
    assert UserModel.objects.filter(username="normal2").count() == 0

    admins = UserModel.objects.filter(username="admin")
    assert admins.count() == 1
    assert admins.first().username == "admin"


@pytest.mark.django_db
def test_populate_db_command_with_json_data_to_assign():
    """
    Test that json_data_to_assign assigns org/group/event fields.
    """
    call_command("flush", "--noinput")
    call_command("loaddata", "fixtures/topics.json")

    fixture_path = (
        Path(__file__).resolve().parent / "fixtures" / "populate_db_assigned.json"
    )

    call_command(
        "populate_db",
        users=1,
        orgs_per_user=1,
        groups_per_org=1,
        events_per_org=1,
        events_per_group=1,
        resources_per_entity=1,
        faq_entries_per_entity=1,
        json_data_to_assign=str(fixture_path),
    )

    org = Organization.objects.get(org_name="assigned_org_1")
    assert org.name == "Assigned Organization"
    assert org.tagline == "Assigned org tagline"

    group = Group.objects.get(group_name="assigned_group_1")
    assert group.name == "Assigned Group"
    assert group.tagline == "Assigned group tagline"

    org_event = Event.objects.get(name="Assigned Org Event")
    assert org_event.tagline == "Assigned org event tagline"
    assert org_event.type == "learn"

    group_event = Event.objects.get(name="Assigned Group Event")
    assert group_event.tagline == "Assigned group event tagline"
    assert group_event.type == "action"
