import datetime
import random

import factory

from .models import Faq, Location, Resource, ResourceTopic, Task, Topic, TopicFormat

# MARK: Main Tables


class FaqFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Faq

    name = factory.Faker("name")
    question = factory.Faker("text")


class EntityLocationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Location

    @factory.post_generation
    def location(self, create, extracted, **kwargs):
        # Latitude, longitude, bounding box and display name for preselected locations.
        random_locations = [
            [
                "52.510885",
                "13.3989367",
                ["52.3382448", "52.6755087", "13.0883450", "13.7611609"],
                "Berlin, Germany",
            ],
            [
                "48.8534951",
                "2.3483915",
                ["48.8155755", "48.9021560", "2.2241220", "2.4697602"],
                "Paris, Ile-de-France, Metropolitan France, France",
            ],
            [
                "38.8950368",
                "-77.0365427",
                ["38.7916303", "38.9959680", "-77.1197949", "-76.9093660"],
                "Washington, District of Columbia, United States",
            ],
            [
                "55.625578",
                "37.6063916",
                ["55.1421745", "56.0212238", "36.8031012", "37.9674277"],
                "Moscow, Central Federal District, Russia",
            ],
            [
                "40.190632",
                "116.412144",
                ["39.1707096", "41.0595584", "115.4172086", "117.7371243"],
                "Beijing, China",
            ],
        ]

        self.location_idx = random.randint(0, len(random_locations) - 1)
        self.lat = random_locations[self.location_idx][0]
        self.lon = random_locations[self.location_idx][1]
        self.bbox = random_locations[self.location_idx][2]
        self.display_name = random_locations[self.location_idx][3]


class EventLocationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Location

    @factory.post_generation
    def location(self, create, extracted, **kwargs):
        # Latitude, longitude, bounding box and display name for preselected locations.
        random_locations = [
            [
                "52.5162699",
                "13.377703399031432",
                ["52.5161170", "52.5164328", "13.3775798", "13.3778251"],
                "Brandenburg Gate, 1, Pariser Platz, Dorotheenstadt, Mitte, Berlin, 10117, Germany",
            ],
            [
                "48.8582599",
                "2.2945006358633115",
                ["48.8574753", "48.8590453", "2.2933119", "2.2956897"],
                "Eiffel Tower, 5, Avenue Anatole France, Quartier du Gros-Caillou, 7th Arrondissement, Paris, Ile-de-France, Metropolitan France, 75007, France",
            ],
            [
                "38.889212150000006",
                "-77.05017197314066",
                ["38.8890125", "38.8895317", "-77.0503866", "-77.0499568"],
                "Lincoln Memorial, Lincoln Steps, Ward 2, Washington, District of Columbia, 20418, United States",
            ],
            [
                "55.7535924",
                "37.62148945731688",
                ["55.7519945", "55.7552072", "37.6179275", "37.6234106"],
                "Red Square, 4, Kitay-gorod, Tverskoy District, Moscow, Central Federal District, Russia",
            ],
            [
                "39.90272175",
                "116.39144087676334",
                ["39.8988884", "39.9058312", "116.3896532", "116.3932766"],
                "Tian'anmen Square, Donghuamen Subdistrict, 首都功能核心区, Dongcheng District, Beijing, 100010, China",
            ],
        ]

        self.location_idx = random.randint(0, len(random_locations) - 1)
        self.lat = random_locations[self.location_idx][0]
        self.lon = random_locations[self.location_idx][1]
        self.bbox = random_locations[self.location_idx][2]
        self.display_name = random_locations[self.location_idx][3]


class ResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Resource

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("name")
    description = factory.Faker("text")
    location = factory.SubFactory(EntityLocationFactory)
    url = factory.Faker("url")
    is_private = factory.Faker("boolean")
    terms_checked = factory.Faker("boolean")
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
    creation_date = factory.LazyFunction(
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
