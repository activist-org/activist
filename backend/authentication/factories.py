from typing import Any

import factory

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserTask,
    UserTopic,
)

# MARK: Main Tables


class SupportEntityTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SupportEntityType

    name = factory.Faker("word")


class SupportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Support

    supporter_type = factory.SubFactory(SupportEntityTypeFactory)
    supporter_entity = factory.SubFactory("entities.factories.OrganizationFactory")
    supported_type = factory.SubFactory(SupportEntityTypeFactory)
    supported_entity = factory.SubFactory("entities.factories.OrganizationFactory")


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserModel
        exclude = ("plaintext_password",)
        django_get_or_create = ("username",)

    username = factory.Faker("user_name")
    name = factory.Faker("name")
    description = factory.Faker("text", max_nb_chars=500)
    verified = factory.Faker("boolean")
    verification_method = factory.Faker("word")
    verification_code = factory.Faker("uuid4")
    email = factory.Faker("email")
    social_links = factory.List([factory.Faker("user_name") for _ in range(3)])
    is_private = factory.Faker("boolean")
    is_high_risk = factory.Faker("boolean")
    creation_date = factory.Faker("date_time_this_decade", before_now=True)
    plaintext_password = factory.PostGenerationMethodCall("set_password", "password")

    # Workaround for the build method
    # Does not work with the create method at the moment
    # verification_partner field references itself
    @factory.post_generation
    def verification_partner(
        self, create: bool, extracted: bool, **kwargs: dict[str, Any]
    ) -> None:
        if not create:
            # Simple build, do nothing.
            return
        if extracted:
            pass


# MARK: Bridge Tables


class UserResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserResource

    user_id = factory.SubFactory(UserFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class UserTaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserTask

    user_id = factory.SubFactory(UserFactory)
    task_id = factory.SubFactory("content.factories.TaskFactory")


class UserTopicFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserTopic

    user_id = factory.SubFactory(UserFactory)
    topic_id = factory.SubFactory("content.factories.TopicFactory")
