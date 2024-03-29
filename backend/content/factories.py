import datetime

import factory

from .models import Faq, Resource, ResourceTopic, Tag, Task, Topic, TopicFormat


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
    private = factory.Faker("boolean")
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    last_updated = factory.LazyFunction(datetime.datetime.now)


class TagFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Tag

    text = factory.Faker("text")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deprecation_date = factory.Faker("date")


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task

    name = factory.Faker("word")
    description = factory.Faker("text")
    tags = factory.List([factory.Faker("word") for _ in range(10)])
    creation_date = factory.Faker("date_time_this_decade", before_now=True)
    deletion_date = factory.Faker("date_time_this_decade", before_now=False)


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

    topic_id = factory.SubFactory(TopicFactory)
    format_id = factory.SubFactory("events.factories.FormatFactory")
