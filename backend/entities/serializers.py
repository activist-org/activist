from rest_framework import serializers

from .models import *


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = (
            "id",
            "name",
            "tagline",
            "social_accounts",
            "total_flags",
            "created_by",
            "creation_date",
            "deletion_date",
        )
