from typing import Any

import factory

from .models import (
    Support,
    SupportEntityType,
    UserModel,
    UserResource,
    UserSocialLink,
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
    location = factory.Faker("city")
    description = factory.Faker("text", max_nb_chars=500)
    verified = factory.Faker("boolean")
    verification_method = factory.Faker("word")
    verification_code = factory.Faker("uuid4")
    email = factory.Faker("email")
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


# MARK: Bridge Tables


class UserResourceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserResource

    user_id = factory.SubFactory(UserFactory)
    resource_id = factory.SubFactory("content.factories.ResourceFactory")


class UserSocialLinkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserSocialLink

    user_id = factory.SubFactory(UserFactory)
    link_id = factory.SubFactory("content.factories.SocialLinkFactory")


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
