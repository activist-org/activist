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
    EventResource,
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

    orgs = factory.SubFactory("communities.organizations.factories.OrganizationFactory")
    # Note: Events need organizations but do not need groups.
    # groups = factory.SubFactory("communities.groups.factories.GroupFactory")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    type = random.choice(["learn", "action"])
    online_location_link = factory.Faker("url")
    offline_location = factory.SubFactory("content.factories.EventLocationFactory")
    is_private = factory.Faker("boolean")
    start_time = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
        + datetime.timedelta(
            # Weighted distribution:
            # - 30% within 1 day
            # - 30% within 7 days
            # - 20% within 30 days
            # - 10% far future (30-90 days)
            # - 10% past events
            days=random.choices(
                [
                    random.randint(0, 1),  # today or tomorrow
                    random.randint(2, 7),  # this week
                    random.randint(8, 30),  # this month
                    random.randint(31, 90),  # far future
                    random.randint(-30, -1),  # past events
                ],
                weights=[30, 30, 20, 10, 10],
                k=1,
            )[0],
            # Events between 8 AM and 8 PM.
            hours=random.randint(8, 20),
            # Round to 15-minute intervals.
            minutes=random.choice([0, 15, 30, 45]),
        )
    )
    end_time = factory.LazyAttribute(
        lambda obj: obj.start_time
        + datetime.timedelta(
            hours=random.randint(1, 8)  # events last 1-8 hours
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


# MARK: Attendee


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


# MARK: Attendee Status


class EventAttendeeStatusFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventAttendeeStatus model instances.
    """

    class Meta:
        model = EventAttendeeStatus

    status_name = factory.Faker("word")


# MARK: FAQ


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
    order = factory.Faker("random_int", min=0, max=100)
    event = factory.SubFactory(EventFactory)


# MARK: Flag


class EventFlagFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Event Flag models.
    """

    class Meta:
        model = EventFlag

    event = factory.SubFactory("events.factories.EventFactory")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(
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


# MARK: Resource


class EventResourceFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventResource model instances.
    """

    class Meta:
        model = EventResource

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


# MARK: Text


class EventTextFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventText model instances.
    """

    class Meta:
        model = EventText

    iso = "en"
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    get_involved_url = "https://activist.org/"
