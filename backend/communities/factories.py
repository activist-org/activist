# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Factory definition for creating StatusType model instances.
"""

import factory


class StatusTypeFactory(factory.django.DjangoModelFactory):
    """
    Factory for creating instances of the StatusType model for testing or seeding data.

    Attributes
    ----------
    name : str
        The default name assigned to the StatusType instance ("Active").
    """

    class Meta:
        """
        Metadata for the StatusTypeFactory.
        """

        model = "communities.StatusType"
        django_get_or_create = ("name",)

    name = "Active"
