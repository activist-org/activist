import datetime
import random

import factory

from .models import (
    Group,
    GroupEvent,
    GroupMember,
    GroupResource,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationApplicationStatus,
    OrganizationEvent,
    OrganizationMember,
    OrganizationResource,
    OrganizationTask,
    OrganizationTopic,
)


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    name = factory.Faker("word")
    tagline = factory.Faker("word")
    location = factory.Faker("address")
    status = factory.Faker("word")
    description = factory.Faker("paragraph")
    members = factory.List([factory.Faker("name") for _ in range(10)])
    supporters = factory.List([factory.Faker("name") for _ in range(10)])
    images_url = factory.List([factory.Faker("word") for _ in range(10)])
    topics = factory.List([factory.Faker("word") for _ in range(10)])
    social_accounts = factory.List([factory.Faker("word") for _ in range(10)])
    total_flags = random.randint(1, 100)
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    high_risk = random.choice([True, False])
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.LazyFunction(datetime.datetime.now)


class OrganizationApplicationStatusFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationApplicationStatus

    status_name = factory.Faker("word")


class OrganizationApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationApplication

    org_id = factory.SubFactory(OrganizationFactory)
    status = factory.SubFactory(OrganizationApplicationStatusFactory)
    orgs_in_favor = factory.List(
        [factory.Faker("word") for _ in range(10)]
    )  # orgs_in_favor
    orgs_against = factory.List(
        [factory.Faker("word") for _ in range(10)]
    )  # orgs_against
    creation_date = factory.LazyFunction(datetime.datetime.now)
    status_update = factory.LazyFunction(datetime.datetime.now)


class OrganizationEventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationEvent

    org_id = factory.SubFactory(OrganizationFactory)
    event_id = factory.SubFactory("events.factories.EventFactory")


class OrganizationMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationMember

    org_id = factory.SubFactory(OrganizationFactory)
    user_id = factory.SubFactory("authentication.factories.UserFactory")
    is_owner = random.choice([True, False])
    is_admin = random.choice([True, False])
    is_comms = random.choice([True, False])


class OrganizationResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationResource

    org_id = factory.SubFactory(OrganizationFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class GroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Group

    org_id = factory.SubFactory(OrganizationFactory)
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    description = factory.Faker("paragraph")
    social_accounts = factory.List([factory.Faker("word") for _ in range(10)])
    total_flags = random.randint(1, 100)
    creation_by = factory.SubFactory("authentication.factories.UserFactory")
    creation_date = factory.LazyFunction(datetime.datetime.now)
    deletion_date = factory.LazyFunction(datetime.datetime.now)


class OrganizationTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationTask

    org_id = factory.SubFactory(OrganizationFactory)
    task_id = factory.SubFactory("content.factories.TaskFactory")
    group_id = factory.SubFactory(GroupFactory)


class OrganizationTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationTopic

    org_id = factory.SubFactory(OrganizationFactory)
    topic_id = factory.SubFactory("content.factories.TopicFactory")


class GroupEventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupEvent

    group_id = factory.SubFactory(GroupFactory)
    event_id = factory.SubFactory("events.factories.EventFactory")


class GroupMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupMember

    group_id = factory.SubFactory(GroupFactory)
    user_id = factory.SubFactory("authentication.UserFactory")
    is_admin = random.choice([True, False])


class GroupResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupResource

    group_id = factory.SubFactory(GroupFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class GroupTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupTopic

    group_id = factory.SubFactory(GroupFactory)
    topic_id = factory.SubFactory("content.factories.Topic")
