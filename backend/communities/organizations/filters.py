import django_filters
from communities.organizations.models import Organization
from content.models import Topic, Location

class OrganizationFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    topics = django_filters.ModelMultipleChoiceFilter(
        field_name="topics__type",  # Or simply "topics" if you want to filter by ID
        to_field_name="type",       # This is the field on Topic model to match against
        queryset=Topic.objects.all(),
        conjoined=True
    )
    location = django_filters.CharFilter(
        field_name="location__display_name",
        lookup_expr="icontains",
    )

    class Meta:
        model = Organization
        fields = ["name", "topics", "location"]
