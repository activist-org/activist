from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer[Event]):
    class Meta:
        model = Event
        fields = (
            "id",
            "name",
            "tagline",
            "type",
            "description",
            "get_involved_text",
            "online_location_link",
            "offline_location_name",
            "offline_location_lat",
            "offline_location_long",
            "start_time",
            "end_time",
            "created_by",
            "creation_date",
            "deletion_date",
        )
