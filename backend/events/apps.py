# SPDX-License-Identifier: AGPL-3.0-or-later
from django.apps import AppConfig


class EventsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "events"

    def ready(self) -> None:
        import events.signals    # noqa
