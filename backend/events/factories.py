# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of models in the events app.
"""

# mypy: ignore-errors
import datetime
import random

import factory

from events.models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFaq,
    EventFlag,
    EventSocialLink,
    EventText,
    Format,
    Role,
)

# MARK: Event


class EventFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Event model instances.
    """

    class Meta:
        model = Event
        django_get_or_create = ("created_by", "orgs")

    orgs = factory.SubFactory("communities.organizations.factories.OrganizationFactory")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    type = random.choice(["learn", "action"])
    online_location_link = factory.Faker("url")
    offline_location = factory.SubFactory("content.factories.EventLocationFactory")
    is_private = factory.Faker("boolean")
    start_time = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    end_time = factory.LazyAttribute(
        lambda x: (
            datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=1)
        )
    )
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deletion_date = random.choice(
        [
            None,
            datetime.datetime.now(tz=datetime.timezone.utc)
            + datetime.timedelta(days=30),
        ]
    )
    setting = random.choice(["online", "offline"])


# MARK: Event Flag


class EventFlagFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Event Flag models.
    """

    class Meta:
        model = EventFlag

    event = factory.SubFactory("events.factories.EventFactory")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    created_on = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


# MARK: Format


class FormatFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Format model instances.
    """

    class Meta:
        model = Format

    name = factory.Faker("word")
    description = factory.Faker(provider="text", locale="la")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("future_date", end_date="+30d")


# MARK: Role


class RoleFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Role model instances.
    """

    class Meta:
        model = Role

    name = factory.Faker("word")
    is_custom = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("future_date", end_date="+30d")


# MARK: Bridge Tables


class EventAttendeeFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventAttendee model instances.
    """

    class Meta:
        model = EventAttendee

    event = factory.SubFactory(EventFactory)
    user = factory.SubFactory("authentication.factories.UserFactory")
    role = factory.SubFactory(RoleFactory)
    attendee_status = factory.SubFactory("events.factories.EventAttendeeStatusFactory")


class EventAttendeeStatusFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventAttendeeStatus model instances.
    """

    class Meta:
        model = EventAttendeeStatus

    status_name = factory.Faker("word")


class EventSocialLinkFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventSocialLink model instances.
    """

    class Meta:
        model = EventSocialLink

    link = "https://www.activist.org"
    label = "social link"
    order = random.randint(0, 10)
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class EventFaqFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Faq model instances.
    """

    class Meta:
        model = EventFaq

    iso = "en"
    primary = factory.Faker("boolean")
    question = factory.Faker(provider="text", locale="la")
    answer = factory.Faker(provider="text", locale="la")
    order = factory.Faker("random_int", min=1, max=100)


class EventTextFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventText model instances.
    """

    class Meta:
        model = EventText

    iso = "en"
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
