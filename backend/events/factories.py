import datetime
import random

import factory

from authentication.models import UserModel

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTask,
    EventTopic,
    Format,
    Role,
)

# MARK: Main Tables


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    name = factory.Faker("name")
    tagline = factory.Faker("word")
    type = factory.Faker("word")
    online_location_link = factory.Faker("url")
    offline_location_lat = factory.Faker("latitude")
    offline_location_long = factory.Faker("longitude")
    start_time = factory.LazyFunction(datetime.datetime.now)
    end_time = factory.Faker("future_date", end_date="+15d")
    created_by = created_by = (
        factory.Iterator(UserModel.objects.exclude(username="admin").all())
        if UserModel.objects.exclude(username="admin").exists()
        else factory.SubFactory("authentication.factories.UserFactory")
    )
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = random.choice([None, factory.Faker("future_date", end_date="+30d")])
    is_private = factory.Faker("boolean")


class FormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Format

    name = factory.Faker("word")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    last_updated = factory.LazyFunction(datetime.datetime.now)
    deprecation_date = factory.Faker("future_date", end_date="+30d")


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    name = factory.Faker("word")
    is_custom = factory.Faker("boolean")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    last_updated = factory.LazyFunction(datetime.datetime.now)
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


class EventTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventTopic

    event_id = factory.SubFactory(EventFactory)
    topic_id = factory.SubFactory("content.factories.TopicFactory")
