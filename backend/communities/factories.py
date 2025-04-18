# SPDX-License-Identifier: AGPL-3.0-or-later
import factory

from communities.models import StatusType


class StatusTypeFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = StatusType
        django_get_or_create = ("name",)

    name = "Active"
