# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Provides classes for pagination control.
"""

from rest_framework import pagination

from core import custom_settings


class CustomPagination(pagination.PageNumberPagination):
    """
    Class to provide custom pagination given page size parameters.
    """

    page_size = custom_settings.PAGINATION_PAGE_SIZE
    page_size_query_param = "page_size"
    max_page_size = custom_settings.PAGINATION_MAX_PAGE_SIZE
