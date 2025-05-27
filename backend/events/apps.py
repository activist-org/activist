# SPDX-License-Identifier: AGPL-3.0-or-later
"""
App configuration for the events module.
"""

from django.apps import AppConfig


class EventsConfig(AppConfig):
    """
    Class for configuring the events app.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "events"
