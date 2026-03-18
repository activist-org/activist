# SPDX-License-Identifier: AGPL-3.0-or-later
"""
A class for filtering organizations based on user defined properties.
"""

from typing import Any

import django_filters
from django.db.models import QuerySet

from communities.organizations.models import Organization
from content.models import Topic


class OrganizationFilter(django_filters.FilterSet):  # type: ignore[misc]
    """
    General class to allow filtering organizations based on URL parameters.
    """

    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    topics = django_filters.ModelMultipleChoiceFilter(
        field_name="topics__type",  # simply "topics" if you want to filter by ID
        to_field_name="type",  # the field on Topic model to match against
        queryset=Topic.objects.all(),
        method="filter_topics",
    )
    location = django_filters.CharFilter(
        field_name="location__address_or_name",
        lookup_expr="icontains",
    )

    def filter_topics(
        self,
        queryset: QuerySet[Organization],
        name: str,
        value: QuerySet[Topic] | list[Any],
    ) -> QuerySet[Organization]:
        """
        Filter by topic type; type hint helps drf-spectacular infer schema.

        Parameters
        ----------
        queryset : QuerySet[Organization]
            Base queryset of organizations.
        name : str
            Filter field name (unused).
        value : QuerySet[Topic] | list[Any]
            Selected Topic instances or list of topic types to filter by.

        Returns
        -------
        QuerySet[Organization]
            Organizations filtered by the given topic type(s).
        """
        if not value:
            return queryset
        if isinstance(value, QuerySet):
            types = list(value.values_list("type", flat=True))
        else:
            types = [getattr(t, "type", t) for t in value]
        return queryset.filter(topics__type__in=types)

    class Meta:
        model = Organization
        fields = ["name", "topics", "location"]
