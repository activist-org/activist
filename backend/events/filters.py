# SPDX-License-Identifier: AGPL-3.0-or-later
from datetime import date, datetime
from typing import Any, Union

import django_filters
from django.db.models.query import QuerySet

from content.models import Topic
from events.models import Event


class EventFilters(django_filters.FilterSet):  # type: ignore[misc]
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    topics = django_filters.ModelMultipleChoiceFilter(
        field_name="topics__type",  # Or simply "topics" if you want to filter by ID
        to_field_name="type",       # This is the field on Topic model to match against
        queryset=Topic.objects.all(),
        conjoined=True
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
    active_on = django_filters.DateTimeFilter(
        method="filter_active_on",
        label="Active on (exact datetime)",
    )

    def filter_active_on(
        self,
        queryset: QuerySet[Any, Any],
        name: str,
        day: Union[date, datetime]
    ) -> QuerySet[Any, Any]:
        start = datetime.combine(day, datetime.min.time())
        end = datetime.combine(day, datetime.max.time())
        return queryset.filter(start_time__lte=end, end_time__gte=start)
    class Meta:
        model = Event
        fields = ["name", "topics", "type", "setting", "active_on", "location"]
