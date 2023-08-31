from rest_framework import serializers

from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "name",
            "password",
            "location",
            "description",
            "verified",
            "verification_method",
            "verification_partner",
            "social_accounts",
            "total_flags",
            "creation_date",
            "deletion_date",
        )
