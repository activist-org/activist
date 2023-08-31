from rest_framework import serializers

from .models import *

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
