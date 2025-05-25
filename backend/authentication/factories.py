# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of models in the authentication app.
"""

# mypy: ignore-errors
from typing import Any

import factory

from authentication.models import Support, SupportEntityType, UserModel

# MARK: Support


class SupportEntityTypeFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating SupportEntityType model instances.
    """

    class Meta:
        model = SupportEntityType

    name = factory.Faker("word")


class SupportFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating Support model instances.

    Notes
    -----
    This class generates mock `Support` instances, which associate supporters with supported entities.
    It uses other factories like `SupportEntityTypeFactory` to generate related data.
    """

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


# MARK: User


class UserFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating UserModel instances.
    """

    class Meta:
        model = UserModel
        exclude = ("plaintext_password",)
        django_get_or_create = ("username",)

    username = factory.Faker("user_name")
    name = factory.Faker("name")
    location = factory.Faker("city")  # users just have a string location
    description = factory.Faker(provider="text", locale="la", max_nb_chars=500)
    verified = factory.Faker("boolean")
    verification_method = factory.Faker("word")
    verification_code = factory.Faker("uuid4")
    email = factory.Faker("email")
    is_private = factory.Faker("boolean")
    is_high_risk = factory.Faker("boolean")
    creation_date = factory.Faker("date_time_this_decade", before_now=True)
    plaintext_password = factory.PostGenerationMethodCall("set_password", "password")

    # Workaround for the build method.
    # Does not work with the create method at the moment.
    # verification_partner field references itself.
    @factory.post_generation
    def verification_partner(
        self, create: bool, extracted: bool, **kwargs: dict[str, Any]
    ) -> None:
        """
        Post-generation hook for the `verification_partner` field.

        This workaround is needed because the `verification_partner` field references itself.
        It does nothing if not in `create` mode.

        Parameters
        ----------
        create : bool
            Whether the object is being created (True) or just built (False).

        extracted : bool
            Whether a value was passed for this field during creation.

        **kwargs : dict[str, Any]
            Additional keyword arguments.
        """
        if not create:
            # Simple build, do nothing.
            return
