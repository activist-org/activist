# SPDX-License-Identifier: AGPL-3.0-or-later

import django_filters

"""
A class for filtering UUID values with an in__ filter.
"""


class UUIDInFilter(django_filters.BaseInFilter, django_filters.UUIDFilter):
    pass
