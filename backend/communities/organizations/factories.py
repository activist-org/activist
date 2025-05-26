# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of Organization models in the communities app.
"""

# mypy: ignore-errors
import datetime
import random

import factory

from communities.organizations.models import (
    Organization,
    OrganizationApplication,
    OrganizationApplicationStatus,
    OrganizationFaq,
    OrganizationImage,
    OrganizationMember,
    OrganizationSocialLink,
    OrganizationTask,
    OrganizationText,
)

# MARK: Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Organization model instances.
    """

    class Meta:
        model = Organization
        django_get_or_create = ("created_by",)

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    get_involved_url = "https://activist.org/"
    terms_checked = factory.Faker("boolean")
    status = factory.SubFactory(
        "communities.factories.StatusTypeFactory", name="Active"
    )
    is_high_risk = factory.Faker("boolean")
    location = factory.SubFactory("content.factories.EntityLocationFactory")
    acceptance_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


# MARK: Bridge Tables


class OrganizationApplicationStatusFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationApplication model instances.
    """

    class Meta:
        model = OrganizationApplicationStatus

    status_name = factory.Faker("word")


class OrganizationApplicationFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationApplication model instances.
    """

    class Meta:
        model = OrganizationApplication

    org = factory.SubFactory(OrganizationFactory)
    status = factory.SubFactory(OrganizationApplicationStatusFactory)
    orgs_in_favor = factory.List([factory.Faker("word") for _ in range(10)])
    orgs_against = factory.List([factory.Faker("word") for _ in range(10)])
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    status_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class OrganizationImageFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationImage model instances.
    """

    class Meta:
        model = OrganizationImage

    org = factory.SubFactory(OrganizationFactory)
    image = factory.SubFactory("content.factories.ImageFactory")


class OrganizationMemberFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationMember model instances.
    """

    class Meta:
        model = OrganizationMember

    org = factory.SubFactory(OrganizationFactory)
    user = factory.SubFactory("authentication.factories.UserFactory")
    is_owner = factory.Faker("boolean")
    is_admin = factory.Faker("boolean")
    is_comms = factory.Faker("boolean")


class OrganizationSocialLinkFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationSocialLink model instances.
    """

    class Meta:
        model = OrganizationSocialLink

    link = "https://www.activist.org"
    label = "social link"
    order = random.randint(0, 10)
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class OrganizationFaqFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Faq model instances.
    """

    class Meta:
        model = OrganizationFaq

    iso = "en"
    primary = factory.Faker("boolean")
    question = factory.Faker(provider="text", locale="la")
    answer = factory.Faker(provider="text", locale="la")
    order = factory.Faker("random_int", min=1, max=100)


class OrganizationTaskFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationTask model instances.
    """

    class Meta:
        model = OrganizationTask

    org = factory.SubFactory(OrganizationFactory)
    task = factory.SubFactory("content.factories.TaskFactory")
    group = factory.SubFactory("communities.groups.factories.GroupFactory")


class OrganizationTextFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating OrganizationText model instances.
    """

    class Meta:
        model = OrganizationText

    iso = "en"
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    donate_prompt = factory.Faker(provider="text", locale="la")
