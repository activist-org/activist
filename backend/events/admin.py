from django.contrib import admin

from .models import (
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
