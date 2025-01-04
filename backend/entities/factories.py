import datetime

import factory

from .models import (
    Group,
    GroupImage,
    GroupMember,
    GroupText,
    Organization,
    OrganizationApplication,
    OrganizationApplicationStatus,
    OrganizationImage,
    OrganizationMember,
    OrganizationTask,
    OrganizationText,
)

# MARK: Main Tables


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization
        django_get_or_create = ("created_by",)

    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    get_involved_url = "https://activist.org/"
    terms_checked = factory.Faker("boolean")
    status = factory.SubFactory("entities.factories.StatusTypeFactory", name="Active")
    is_high_risk = factory.Faker("boolean")
    location = factory.SubFactory("content.factories.EntityLocationFactory")
    acceptance_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


class GroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Group

    org = factory.SubFactory(OrganizationFactory)
    created_by = factory.SubFactory("authentication.factories.UserFactory")
    name = factory.Faker("word")
    tagline = factory.Faker("word")
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    terms_checked = factory.Faker("boolean")
    category = factory.Faker("word")
    location = factory.SubFactory("content.factories.EntityLocationFactory")


# MARK: Bridge Tables


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


class GroupTextFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GroupText

    iso = "en"
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    donate_prompt = factory.Faker(provider="text", locale="la")


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
    creation_date = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )
    status_updated = factory.LazyFunction(
        lambda: datetime.datetime.now(tz=datetime.timezone.utc)
    )


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


class OrganizationTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationTask

    org_id = factory.SubFactory(OrganizationFactory)
    task_id = factory.SubFactory("content.factories.TaskFactory")
    group_id = factory.SubFactory(GroupFactory)


class OrganizationTextFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationText

    iso = "en"
    primary = factory.Faker("boolean")
    description = factory.Faker(provider="text", locale="la", max_nb_chars=1000)
    get_involved = factory.Faker(provider="text", locale="la")
    donate_prompt = factory.Faker(provider="text", locale="la")


class StatusTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "entities.StatusType"
        django_get_or_create = ("name",)

    name = "Active"
