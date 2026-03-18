# SPDX-License-Identifier: AGPL-3.0-or-later
"""
A class for filtering events based on user defined properties.
"""

import uuid
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
        method="filter_topics",
    )
    location = django_filters.CharFilter(
        field_name="physical_location__address_or_name",
        lookup_expr="icontains",
    )

    type = django_filters.CharFilter(
        field_name="type",
        lookup_expr="iexact",
    )

    location_type = django_filters.CharFilter(
        field_name="location_type",
        lookup_expr="iexact",
    )

    days_ahead = django_filters.NumberFilter(
        method="filter_days_ahead",
        label="Upcoming events within N days",
    )

    id = django_filters.CharFilter(method="filter_ids")

    def filter_topics(
        self,
        queryset: QuerySet[Any, Any],
        name: str,
        value: QuerySet[Topic] | list[Any],
    ) -> QuerySet[Any, Any]:
        """
        Filter by topic type; type hint helps drf-spectacular infer schema.

        Parameters
        ----------
        queryset : QuerySet[Any, Any]
            Base queryset of events.
        name : str
            Filter field name (unused).
        value : QuerySet[Topic] | list[Any]
            Selected Topic instances or list of topic types to filter by.

        Returns
        -------
        QuerySet[Any, Any]
            Events filtered by the given topic type(s).
        """
        if not value:
            return queryset
        if hasattr(value, "values_list"):
            types = list(value.values_list("type", flat=True))
        else:
            types = [getattr(t, "type", t) for t in value]
        return queryset.filter(topics__type__in=types)

    def filter_ids(
        self, queryset: QuerySet[Any, Any], name: str, _value: str
    ) -> QuerySet[Any, Any]:
        """
        Filter events with a single event ID or multiple IDs, passed as multiple individual 'id' parameters or a single id parameter with comma separated IDs.

        Parameters
        ----------
        queryset : QuerySet[Any, Any]
            Base queryset.

        name : str
            Filter field name (``id``).

        _value : str
            ID parameter value (unused).

        Returns
        -------
        QuerySet[Any, Any]
            Event(s) with ID matching the passed ``id`` parameter(s).
        """

        raw = self.data.getlist(name)

        # data validation
        if not raw:
            return queryset.none()

        # getlist can sometimes return a list with a single string of all IDs separated by commas
        raw_values = [
            part.strip()
            for item in raw
            for part in str(item).split(",")
            if part.strip()
        ]

        uuids = []
        for v in raw_values:
            try:
                # UUID value validation
                uuids.append(uuid.UUID(str(v).strip()))
            except ValueError:
                # If a single UUID is invalid it should still filter for the valid ones
                continue

        return queryset.filter(id__in=uuids) if uuids else queryset.none()

    def filter_days_ahead(
        self, queryset: QuerySet[Any, Any], name: str, days: int
    ) -> QuerySet[Any, Any]:
        """
        Filter events occurring within the next ``days`` days as a rolling window.

        Parameters
        ----------
        queryset : QuerySet[Any, Any]
            Base queryset.

        name : str
            Filter field name (``days``).

        days : int
            Number of days into the future.

        Returns
        -------
        QuerySet[Any, Any]
            Events starting between ``now`` and ``now + days`` (inclusive).
        """
        now = timezone.now()

        try:
            days_ahead_int = int(days)

        except Exception:
            return queryset.none()

        if days_ahead_int < 0:
            return queryset.none()

        end = now if days_ahead_int == 0 else now + timedelta(days=days_ahead_int)

        return queryset.filter(
            times__start_time__gte=now, times__start_time__lte=end
        ).distinct()

    class Meta:
        model = Event
        fields = [
            "id",
            "name",
            "topics",
            "type",
            "location_type",
            "location",
            "days_ahead",
        ]
