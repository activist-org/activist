# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of Group models in the communities app.
"""

# mypy: ignore-errors
import datetime
import random

import factory

from communities.groups.models import (
    Group,
    GroupFaq,
    GroupFlag,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupSocialLink,
    GroupText,
)

# MARK: Group


class GroupFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Group model instances.
    """

    class Meta:
        model = Group

    org = factory.SubFactory("communities.organizations.factories.OrganizationFactory")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    terms_checked = factory.Faker("boolean")
    category = factory.Faker("word")
    location = factory.SubFactory("content.factories.EntityLocationFactory")


# MARK: FAQ


class GroupFaqFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Faq model instances.
    """

    class Meta:
        model = GroupFaq

    iso = "en"
    primary = factory.Faker("boolean")
    question = factory.Faker(provider="text", locale="la")
    answer = factory.Faker(provider="text", locale="la")
    order = factory.Faker("random_int", min=0, max=100)
    group = factory.SubFactory(GroupFactory)


# MARK: Flag


class GroupFlagFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupFlag model instances.
    """

    class Meta:
        model = GroupFlag

    group = factory.SubFactory(GroupFactory)
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


# MARK: Image


class GroupImageFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupImage model instances.
    """

    class Meta:
        model = GroupImage

    group = factory.SubFactory(GroupFactory)
    image = factory.SubFactory("content.factories.ImageFactory")


# MARK: Member


class GroupMemberFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupMember model instances.
    """

    class Meta:
        model = GroupMember

    group = factory.SubFactory(GroupFactory)
    user = factory.SubFactory("authentication.factories.UserFactory")
    is_admin = factory.Faker("boolean")


# MARK: Resource


class GroupResourceFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupResource model instances.
    """

    class Meta:
        model = GroupResource

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker(provider="text", locale="la", max_nb_chars=50)
    description = factory.Faker(provider="text", locale="la")
    url = "https://www.activist.org"
    order = factory.Faker("random_int", min=0, max=100)
    location = factory.SubFactory("content.factories.EntityLocationFactory")
    is_private = factory.Faker("boolean")
    terms_checked = factory.Faker("boolean")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


# MARK: Social Link


class GroupSocialLinkFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupSocialLink model instances.
    """

    class Meta:
        model = GroupSocialLink

    link = "https://www.activist.org"
    label = "social link"
    order = random.randint(0, 10)
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


# MARK: Text


class GroupTextFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating GroupText model instances.
    """

    class Meta:
        model = GroupText

    iso = "en"
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    donate_prompt = factory.Faker(provider="text", locale="la")
