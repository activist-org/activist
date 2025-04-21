# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configuration for the communities app.
"""

from django.apps import AppConfig


class CommunitiesConfig(AppConfig):
    """
    Configuration for the communities' app.

    Sets the default auto field type and registers the app under the name 'communities'.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "communities"
