from rest_framework import pagination
from django.conf import settings


class CustomPagination(pagination.PageNumberPagination):
    page_size = settings.PAGINATION_PAGE_SIZE
    page_size_query_param = "pageSize"
    max_page_size = settings.PAGINATION_MAX_PAGE_SIZE
