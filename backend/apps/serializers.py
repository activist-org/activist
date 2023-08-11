from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "date_joined")


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "name",
            "tagline",
            "application_id",
            "social_accounts",
            "total_flags",
            "created_by",
            "creation_date",
        )


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
