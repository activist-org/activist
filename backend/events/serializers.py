from rest_framework import serializers

from .models import *


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = (
            "creation_date",
            "created_by",
            "name",
            "tagline",
            "start_time",
            "end_time",
            "type",
            "format",
            "online_location_link",
            "offline_location_name",
            "offline_location_lat",
            "offline_location_long",
            "description",
            "get_involved_text",
            "deletion_date",
        )