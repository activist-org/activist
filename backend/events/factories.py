import datetime
import random

import factory

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTask,
    EventText,
    EventTopic,
    Format,
    Role,
)

# MARK: Main Tables


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event
        django_get_or_create = ("created_by",)

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    type = random.choice(["learn", "action"])
    online_location_link = factory.Faker("url")
    offline_location = factory.Faker("city")
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
    is_private = factory.Faker("boolean")


class FormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Format

    name = factory.Faker("word")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("future_date", end_date="+30d")


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    name = factory.Faker("word")
    is_custom = factory.Faker("boolean")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("future_date", end_date="+30d")


# MARK: Bridge Tables


class EventAttendeeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventAttendee

    event_id = factory.SubFactory(EventFactory)
    user_id = factory.SubFactory("authentication.factories.UserFactory")
    role_id = factory.SubFactory(RoleFactory)
    attendee_status = factory.SubFactory("events.factories.EventAttendeeStatusFactory")


class EventAttendeeStatusFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventAttendeeStatus

    status_name = factory.Faker("word")


class EventFormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventFormat

    event_id = factory.SubFactory(EventFactory)
    format_id = factory.SubFactory(FormatFactory)


class EventResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventResource

    event_id = factory.SubFactory(EventFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class EventRoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventRole

    event_id = factory.SubFactory(EventFactory)
    role_id = factory.SubFactory(RoleFactory)


class EventTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventTask

    event_id = factory.SubFactory(EventFactory)
    task_id = factory.SubFactory("content.factories.TaskFactory")


class EventTextFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventText

    event_id = factory.SubFactory(EventFactory)
    iso = factory.Faker("word")
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")


class EventTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventTopic

    event_id = factory.SubFactory(EventFactory)
    topic_id = factory.SubFactory("content.factories.TopicFactory")
