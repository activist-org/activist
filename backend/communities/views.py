# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
"""
API views for community model management.
"""

from rest_framework import viewsets

from communities.models import Status
from communities.serializers import StatusSerializer
from core.paginator import CustomPagination

# MARK: Status


class StatusViewSet(viewsets.ModelViewSet[Status]):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    pagination_class = CustomPagination
