# SPDX-License-Identifier: AGPL-3.0-or-later
"""
A class for filtering groups based on user defined properties.
"""

import django_filters

from communities.groups.models import Group
from communities.organizations.models import Organization

class GroupFilter(django_filters.FilterSet):  # type: ignore[misc]
    """
    General class to allow filtering groups based on URL parameters.
    """
    linked_organizations = django_filters.ModelMultipleChoiceFilter(
        field_name="org",
        to_field_name="id",
        queryset=Organization.objects.all(),
    )

    class Meta:
        model = Group
        fields = ['linked_organizations']
