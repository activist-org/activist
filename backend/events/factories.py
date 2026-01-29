# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of models in the events app.
"""

# mypy: ignore-errors
import datetime
import random
from collections.abc import Iterable

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
    EventTime,
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

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    type = random.choice(["learn", "action"])
    online_location_link = factory.Faker("url")
    physical_location = factory.SubFactory("content.factories.EventLocationFactory")
    is_private = factory.Faker("boolean")
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
    # setting
    location_type = random.choice(["online", "physical"])

    @factory.post_generation
    def orgs(self, create, extracted, **kwargs):  # type: ignore[override]
        """Attach organizations via ManyToMany operations."""
        if not create:
            return

        if extracted is None:
            from communities.organizations.factories import OrganizationFactory

            organizations = [OrganizationFactory()]
        elif isinstance(extracted, Iterable) and not isinstance(
            extracted, (str, bytes)
        ):
            organizations = list(extracted)
        else:
            organizations = [extracted]

        self.orgs.set(organizations)

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):  # type: ignore[override]
        """Attach optional groups via ManyToMany operations."""
        if not create or extracted is None:
            return

        if isinstance(extracted, Iterable) and not isinstance(extracted, (str, bytes)):
            groups = list(extracted)
        else:
            groups = [extracted]

        self.groups.set(groups)

    @factory.post_generation
    def times(self, create, extracted, **kwargs):  # type: ignore[override]
        """Attach event times via ManyToMany operations."""
        if not create:
            return

        if extracted is None:
            # Create 1-3 event times by default
            event_times = [EventTimeFactory() for _ in range(random.randint(1, 3))]
        elif isinstance(extracted, Iterable) and not isinstance(
            extracted, (str, bytes)
        ):
            event_times = list(extracted)
        else:
            event_times = [extracted]

        self.times.set(event_times)


# MARK: EventTime


class EventTimeFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating EventTime model instances.
    """

    class Meta:
        model = EventTime

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
        + datetime.timedelta(hours=random.randint(1, 8))  # events last 1-8 hours
    )


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
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    get_involved_url = "https://activist.org/"
