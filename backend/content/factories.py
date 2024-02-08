import datetime

import factory

from .models import Faq, Resource, ResourceTopic, Task, Topic, TopicFormat


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
    topics = factory.List([factory.Faker("word") for _ in range(5)])
    url = factory.Faker("url")
    total_flags = factory.Faker("random_int", min=0, max=100)
    private = factory.Faker("boolean")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    last_updated = factory.LazyFunction(datetime.datetime.now)


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task

    name = factory.Faker("word")
    description = factory.Faker("text")
    tags = factory.List([factory.Faker("word") for _ in range(10)])
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.LazyFunction(datetime.datetime.now)


class TopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Topic

    name = factory.Faker("word")
    active = factory.Faker("boolean")
    description = factory.Faker("text")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deprecation_date = factory.Faker("date")


class ResourceTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ResourceTopic

    resource_id = factory.SubFactory(ResourceFactory)
    topic_id = factory.SubFactory(TopicFactory)


class TopicFormatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = TopicFormat

    format_id = factory.SubFactory("events.factories.FormatFactory")
