# SPDX-License-Identifier: AGPL-3.0-or-later
"""
App configuration for the communities module.
"""

from django.apps import AppConfig


class CommunitiesConfig(AppConfig):
    """
    Configuration for the communities app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "communities"
