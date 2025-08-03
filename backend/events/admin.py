# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Configure Django admin for the events app.
"""

from django.contrib import admin

from events.models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFaq,
    EventFlag,
    EventText,
    Format,
    Role,
)

# MARK: Register

admin.site.register(Event)
admin.site.register(Format)
admin.site.register(Role)
admin.site.register(EventFaq)
admin.site.register(EventAttendee)
admin.site.register(EventAttendeeStatus)
admin.site.register(EventText)

# MARK: Event Flag


class EventFlagAdmin(admin.ModelAdmin[EventFlag]):
    """
    Admin interface for EventFlag model.

    Displays the Event, User and the date of the report filed.
    """

    list_display = ["event", "created_by", "created_on"]


# MARK: Register Admin

admin.site.register(EventFlag, EventFlagAdmin)
