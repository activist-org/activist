# SPDX-License-Identifier: AGPL-3.0-or-later
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
from communities.groups.models import Group
from communities.organizations.factories import OrganizationFactory
from content.factories import EntityLocationFactory

pytestmark = pytest.mark.django_db


def test_group_creation() -> None:
    """
    Test complete group creation with all fields.
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

    assert isinstance(group.id, UUID)
    assert group.org == org
    assert group.created_by == user
    assert isinstance(group.group_name, str)
    assert isinstance(group.creation_date, datetime)
    assert group.terms_checked is True


def test_url_validations() -> None:
    """
    Test that get_involved_url field is a valid URL.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    # 1. Test invalid URL.
    with pytest.raises(ValidationError):
        group = Group(
            org=org,
            created_by=user,
            group_name=fake.company(),
            name=fake.company(),
            location=location,
            category=fake.word(),
            get_involved_url="not a url",
            terms_checked=True,
        )

        group.full_clean()

    # 2. Test valid URL.
    group = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    group.full_clean()


def test_multiple_groups_per_org() -> None:
    """
    Test that multiple groups can be created per organization.
    """
    user = UserFactory()
    org = OrganizationFactory(created_by=user)
    location = EntityLocationFactory()
    fake = Faker()

    group1 = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    group2 = Group.objects.create(
        org=org,
        created_by=user,
        group_name=fake.company(),
        name=fake.company(),
        location=location,
        category=fake.word(),
        get_involved_url=fake.url(),
        terms_checked=True,
    )

    assert Group.objects.count() == 2
    assert group1.org == org
    assert group2.org == org

    org_groups = Group.objects.filter(org=org)
    assert group1 in org_groups
    assert group2 in org_groups
