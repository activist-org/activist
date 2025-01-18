# SPDX-License-Identifier: AGPL-3.0-or-later
import factory


class StatusTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = "communities.StatusType"
        django_get_or_create = ("name",)

    name = "Active"
