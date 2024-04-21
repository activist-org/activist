import datetime

import factory

from .models import (
    Group,
    GroupEvent,
    GroupImage,
    GroupMember,
    GroupResource,
    GroupTopic,
    Organization,
    OrganizationApplication,
    OrganizationApplicationStatus,
    OrganizationEvent,
    OrganizationImage,
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
    description = factory.Faker("text")
    social_accounts = factory.List([factory.Faker("word") for _ in range(10)])
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    high_risk = factory.Faker("boolean")


class OrganizationApplicationStatusFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationApplicationStatus

    status_name = factory.Faker("word")


class OrganizationApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationApplication

    org_id = factory.SubFactory(OrganizationFactory)
    status = factory.SubFactory(OrganizationApplicationStatusFactory)
    orgs_in_favor = factory.List([factory.Faker("word") for _ in range(10)])
    orgs_against = factory.List([factory.Faker("word") for _ in range(10)])
    creation_date = factory.LazyFunction(datetime.datetime.now)
    status_updated = factory.LazyFunction(datetime.datetime.now)


class OrganizationEventFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationEvent

    org_id = factory.SubFactory(OrganizationFactory)
    event_id = factory.SubFactory("events.factories.EventFactory")


class OrganizationImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationImage

    org_id = factory.SubFactory(OrganizationFactory)
    image_id = factory.SubFactory("content.factories.ImageFactory")


class OrganizationMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationMember

    org_id = factory.SubFactory(OrganizationFactory)
    user_id = factory.SubFactory("authentication.factories.UserFactory")
    is_owner = factory.Faker("boolean")
    is_admin = factory.Faker("boolean")
    is_comms = factory.Faker("boolean")


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
    description = factory.Faker("text")
    social_accounts = factory.List([factory.Faker("word") for _ in range(10)])
    created_by = factory.SubFactory("authentication.factories.UserFactory")
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


class GroupImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupImage

    group_id = factory.SubFactory(GroupFactory)
    image_id = factory.SubFactory("content.factories.ImageFactory")


class GroupMemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupMember

    group_id = factory.SubFactory(GroupFactory)
    user_id = factory.SubFactory("authentication.factories.UserFactory")
    is_admin = factory.Faker("boolean")


class GroupResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupResource

    group_id = factory.SubFactory(GroupFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class GroupTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupTopic

    group_id = factory.SubFactory(GroupFactory)
    topic_id = factory.SubFactory("content.factories.TopicFactory")
