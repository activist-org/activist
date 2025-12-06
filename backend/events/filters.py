# SPDX-License-Identifier: AGPL-3.0-or-later
"""
A class for filtering events based on user defined properties.
"""

from datetime import timedelta
from typing import Any

import django_filters
from django.db.models.query import QuerySet
from django.utils import timezone

from content.models import Topic
from events.models import Event


class EventFilters(django_filters.FilterSet):  # type: ignore[misc]
    """
    General class to allow filtering events based on URL parameters.
    """

    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    topics = django_filters.ModelMultipleChoiceFilter(
        field_name="topics__type",  # simply "topics" if you want to filter by ID
        to_field_name="type",  # the field on Topic model to match against
        queryset=Topic.objects.all(),
    )
    location = django_filters.CharFilter(
        field_name="offline_location__display_name",
        lookup_expr="icontains",
    )

    type = django_filters.CharFilter(
        field_name="type",
        lookup_expr="iexact",
    )

    setting = django_filters.CharFilter(
        field_name="setting",
        lookup_expr="iexact",
    )

    days_ahead = django_filters.NumberFilter(
        method="filter_days_ahead",
        label="Upcoming events within N days",
    )

    def filter_days_ahead(
        self, queryset: QuerySet[Any, Any], name: str, days_ahead: int
    ) -> QuerySet[Any, Any]:
        """
        Filter events occurring within the next ``days_ahead`` days as a rolling window.

        Parameters
        ----------
        queryset : QuerySet[Any, Any]
            Base queryset.

        name : str
            Filter field name (``days_ahead``).

        days_ahead : int
            Number of days into the future.

        Returns
        -------
        QuerySet[Any, Any]
            Events starting between ``now`` and ``now + days_ahead`` (inclusive).
        """
        now = timezone.now()

        if not days_ahead:
            return queryset.none()

        days_ahead_int = int(days_ahead)

        if days_ahead_int < 0:
            return queryset.none()

        end = now if days_ahead_int == 0 else now + timedelta(days=days_ahead_int)

        return queryset.filter(start_time__gte=now, start_time__lte=end)

    class Meta:
        model = Event
        fields = [
            "name",
            "topics",
            "type",
            "setting",
            "location",
            "days_ahead",
        ]
