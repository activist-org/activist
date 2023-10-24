import datetime
import random

import factory

from .models import Resource


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
    creation_date = factory.LazyFunction(datetime.datetime.now)
