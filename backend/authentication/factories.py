# SPDX-License-Identifier: AGPL-3.0-or-later
from typing import Any

import factory

from authentication.models import Support, SupportEntityType, UserModel

# MARK: Main Tables


class SupportEntityTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = SupportEntityType

    name = factory.Faker("word")


class SupportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Support

    supporter_type = factory.SubFactory(SupportEntityTypeFactory)
    supporter_entity = factory.SubFactory(
        "communities.organizations.factories.OrganizationFactory"
    )
    supported_type = factory.SubFactory(SupportEntityTypeFactory)
    supported_entity = factory.SubFactory(
        "communities.organizations.factories.OrganizationFactory"
    )


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserModel
        exclude = ("plaintext_password",)
        django_get_or_create = ("username",)

    username = factory.Faker("user_name")
    name = factory.Faker("name")
    location = factory.Faker("city")  # users just have a string location
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
