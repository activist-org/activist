from django.contrib import admin

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventFormat,
    EventResource,
    EventRole,
    EventTask,
    EventTopic,
    Format,
    Role,
)

admin.site.register(Event)
admin.site.register(EventAttendee)
admin.site.register(EventAttendeeStatus)
admin.site.register(EventResource)
admin.site.register(EventRole)
admin.site.register(EventTask)
admin.site.register(EventTopic)
admin.site.register(EventFormat)
admin.site.register(Format)
admin.site.register(Role)
