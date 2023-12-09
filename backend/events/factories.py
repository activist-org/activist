import datetime

import factory

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


class EventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Event

    name = factory.Faker("name")
    tagline = factory.Faker("word")
    type = factory.Faker("word")
    description = factory.Faker("text")
    get_involved_text = factory.Faker("text")
    online_location_link = factory.Faker("url")
    offline_location_name = factory.Faker("word")
    offline_location_lat = factory.Faker("latitude")
    offline_location_long = factory.Faker("longitude")
    start_time = factory.LazyFunction(datetime.datetime.now)
    end_time = factory.Faker("future_date", end_date="+15d")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.Faker("future_date", end_date="+30d")


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


class EventAttendeeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventAttendee

    event_id = factory.SubFactory(EventFactory)
    user_id = factory.SubFactory("authentication.factories.UserFactory")
    role_id = factory.SubFactory(RoleFactory)
    attendee_status = factory.Faker("random_element", elements=[1, 2, 3])


class EventFormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventFormat

    event_id = factory.SubFactory(EventFactory)
    format_id = factory.SubFactory(FormatFactory)


class EventAttendeeStatusFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = EventAttendeeStatus

    status_name = factory.Faker("word")


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
