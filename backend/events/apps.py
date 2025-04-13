# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configuration for the events app.
"""

from django.apps import AppConfig


class EventsConfig(AppConfig):
    """
    Django application configuration for events.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "events"
