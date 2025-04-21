# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Serializers for the communities' app.
"""

from rest_framework import serializers

from communities.models import Status, StatusType

# MARK: Status


class StatusSerializer(serializers.ModelSerializer[Status]):
    """
    Serializer for the status model.
    """

    class Meta:
        """
        Metaclass for the StatusSerializer.
        """

        model = Status
        fields = "__all__"


# MARK: Bridge Tables


class StatusTypeSerializer(serializers.ModelSerializer[StatusType]):
    """
    Serializer for the statusType model.
    """

    class Meta:
        """
        Metaclass for the StatusTypeSerializer.
        """

        model = StatusType
        fields = "__all__"
