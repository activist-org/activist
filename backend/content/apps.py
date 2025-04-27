# SPDX-License-Identifier: AGPL-3.0-or-later
"""
App configuration for the content module.
"""

from django.apps import AppConfig


class contentConfig(AppConfig):
    """
    Class for configuring the content app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "content"
