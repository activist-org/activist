import datetime
import random

import factory

from .models import Resource, ResourceTopic, Task, Topic


class ResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Resource

    name = factory.Faker("name")
    description = factory.Faker("paragraph")
    topics = factory.Faker("words", nb=1)
    location = factory.Faker("address")
    url = factory.Faker("url")
    total_flags = random.randint(1, 100)
    private = random.choice([True, False])
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.LazyFunction(datetime.datetime.now)


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task

    name = factory.Faker("word")
    description = factory.Faker("paragraph")
    location = factory.Faker("address")
    tags = [factory.Faker("word") for _ in range(10)]
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.LazyFunction(datetime.datetime.now)


class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic

    name = factory.Faker("word")
    active = random.choice([True, False])
    description = factory.Faker("paragraph")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deprecation_date = factory.Faker("date")


class ResourceTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ResourceTopic

    resource_id = factory.SubFactory(ResourceFactory)
    topic_id = factory.SubFactory(TopicFactory)


class TopicFormatFactory(factory.django.DjangoModelFactory):
    """Placeholder
    We do not have Factory for events.Format, therefore can not use a Subfactory yet.
    format_id = models.ForeignKey("events.Format", on_delete=models.CASCADE)
    """

    pass
