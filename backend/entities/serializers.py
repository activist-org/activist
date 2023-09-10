from rest_framework import serializers

from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer[Organization]):
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
