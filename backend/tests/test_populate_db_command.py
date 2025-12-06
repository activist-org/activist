# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test to check the numbers of entities (groups, organizations and events) and content (faqs, resources and social links)
created by the populate_db command.
"""

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
