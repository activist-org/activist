"""
Serializers for the communities app.
"""

from rest_framework import serializers

from communities.models import Status, StatusType

# MARK: Main Tables


class StatusSerializer(serializers.ModelSerializer[Status]):
    class Meta:
        model = Status
        fields = "__all__"


# MARK: Bridge Tables


class StatusTypeSerializer(serializers.ModelSerializer[StatusType]):
    class Meta:
        model = StatusType
        fields = "__all__"
