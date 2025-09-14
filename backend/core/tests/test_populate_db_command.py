# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Test to check the numbers of entities (groups, organizations and events) and content (faqs, resources and social links)
created by the Command entity in the populate_db.py script.
"""

import pytest
from django.core.management import call_command

from authentication.models import UserModel
from communities.groups.models import Group
from communities.organizations.models import Organization
from events.models import Event


@pytest.mark.django_db
def test_populate_db_command_basic():
    """Test that the populate_db command creates the expected number of entities."""
    call_command(
        "populate_db", users=2, orgs_per_user=1, groups_per_org=1, events_per_org=1
    )
    assert UserModel.objects.count() == 2
    assert Organization.objects.count() == 2
    assert Group.objects.count() == 2
    assert Event.objects.count() == 2


@pytest.mark.django_db
def test_populate_db_command_zero_users():
    """Test that the populate_db command handles zero users correctly."""
    call_command("populate_db", users=0)
    assert UserModel.objects.count() == 0
    assert Organization.objects.count() == 0
    assert Group.objects.count() == 0
    assert Event.objects.count() == 0
