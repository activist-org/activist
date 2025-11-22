# SPDX-License-Identifier: AGPL-3.0-or-later
"""
A class for filtering organizations based on user defined properties.
"""

import django_filters

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
    )
    location = django_filters.CharFilter(
        field_name="location__display_name",
        lookup_expr="icontains",
    )

    class Meta:
        model = Organization
        fields = ["name", "topics", "location"]
