# SPDX-License-Identifier: AGPL-3.0-or-later
"""
This module configures Django admin for events app models.

Registers event-related models for admin site management.
"""

from django.contrib import admin

from events.models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventText,
    Format,
    Role,
)

# MARK: Main Tables

admin.site.register(Event)
admin.site.register(Format)
admin.site.register(Role)

# MARK: Bridge Tables

admin.site.register(EventAttendee)
admin.site.register(EventAttendeeStatus)
admin.site.register(EventText)
