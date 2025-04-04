# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factory classes for creating event test instances.
"""

import datetime
import random

import factory

from events.models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventSocialLink,
    EventText,
    Format,
    Role,
)

# MARK: Main Tables


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
    # Returns current UTC time
    start_time = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    # Returns time one day in the future
    end_time = factory.LazyAttribute(
        lambda x: (
            datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=1)
        )
    )
    # Returns current UTC time
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


class FormatFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Format model instances.
    """

    class Meta:
        model = Format

    name = factory.Faker("word")
    description = factory.Faker("text")
    # Returns current UTC time
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    # Returns current UTC time
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("future_date", end_date="+30d")


class RoleFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Role model instances.
    """

    class Meta:
        model = Role

    name = factory.Faker("word")
    is_custom = factory.Faker("boolean")
    description = factory.Faker("text")
    # Returns current UTC time
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    # Returns current UTC time
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
    # Returns current UTC time
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    # Returns current UTC time
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


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
