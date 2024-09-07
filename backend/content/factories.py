import datetime

import factory

from .models import Faq, Resource, ResourceTopic, Task, Topic, TopicFormat

# MARK: Main Tables


class FaqFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Faq

    name = factory.Faker("name")
    question = factory.Faker("text")


class ResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Resource

    name = factory.Faker("name")
    description = factory.Faker("text")
    url = factory.Faker("url")
    is_private = factory.Faker("boolean")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    last_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task

    name = factory.Faker("word")
    description = factory.Faker("text")
    tags = factory.List([factory.Faker("word") for _ in range(10)])
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deletion_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic

    name = factory.Faker("word")
    active = factory.Faker("boolean")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    deprecation_date = factory.Faker("date")


# MARK: Bridge Tables


class ResourceTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ResourceTopic

    resource_id = factory.SubFactory(ResourceFactory)
    topic_id = factory.SubFactory(TopicFactory)


class TopicFormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TopicFormat

    format_id = factory.SubFactory("events.factories.FormatFactory")
