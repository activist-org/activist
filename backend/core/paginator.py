from rest_framework import pagination

from core import custom_settings


class CustomPagination(pagination.PageNumberPagination):
    page_size = custom_settings.PAGINATION_PAGE_SIZE
    page_size_query_param = "pageSize"
    max_page_size = custom_settings.PAGINATION_MAX_PAGE_SIZE
