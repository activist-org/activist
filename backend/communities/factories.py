# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factories for creating mock instances of general models in the communities app.
"""

import factory


class StatusTypeFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating StatusType model instances.
    """

    class Meta:
        model = "communities.StatusType"
        django_get_or_create = ("name",)

    name = "Active"
