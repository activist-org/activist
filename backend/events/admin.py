from django.contrib import admin

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTask,
    EventText,
    EventTopic,
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
admin.site.register(EventResource)
admin.site.register(EventRole)
admin.site.register(EventTask)
admin.site.register(EventText)
admin.site.register(EventTopic)
admin.site.register(EventFormat)
