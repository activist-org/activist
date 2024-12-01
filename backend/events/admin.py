from django.contrib import admin

from .models import (
    Event,
    EventAttendee,
    EventAttendeeStatus,
    EventDiscussion,
    EventFaq,
    EventFormat,
    EventResource,
    EventRole,
    EventSocialLink,
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
admin.site.register(EventDiscussion)
admin.site.register(EventFaq)
admin.site.register(EventResource)
admin.site.register(EventRole)
admin.site.register(EventSocialLink)
admin.site.register(EventTask)
admin.site.register(EventText)
admin.site.register(EventTopic)
admin.site.register(EventFormat)
