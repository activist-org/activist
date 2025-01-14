# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="override"
from rest_framework import viewsets

from communities.models import Status
from communities.serializers import StatusSerializer
from core.paginator import CustomPagination

# MARK: Main Tables


class StatusViewSet(viewsets.ModelViewSet[Status]):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    pagination_class = CustomPagination
