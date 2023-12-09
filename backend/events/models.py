"""
Events Models

This file contains models for the events app.

Contents:
    - Event
    - Format
    - Role
    - EventAttendee
    - EventFormat
    - EventAttendeeStatus
    - EventResource
    - EventRole
    - EventTask
    - EventTopic
"""


from django.db import models

from backend.mixins.models import BaseModelMixin


class Event(BaseModelMixin):
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, null=True)
    type = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    get_involved_text = models.TextField(max_length=500)
    online_location_link = models.CharField(max_length=255, null=True)
    offline_location_name = models.CharField(max_length=255, null=True)
    offline_location_lat = models.FloatField(null=True)
    offline_location_long = models.FloatField(null=True)
    start_time = models.DateTimeField(null=True)
    end_time = models.DateTimeField(null=True)
    created_by = models.ForeignKey(
        "authentication.User", related_name="created_events", on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return self.name


class Format(BaseModelMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


class Role(BaseModelMixin):
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


class EventAttendee(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE, null=True)
    attendee_status = models.ForeignKey(
        "EventAttendeeStatus", on_delete=models.CASCADE, default=1
    )

    def __str__(self) -> str:
        return f"{self.user_id} - {self.event_id}"


class EventFormat(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    format_id = models.ForeignKey("Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventAttendeeStatus(BaseModelMixin):
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class EventResource(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(
        "content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventRole(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventTask(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventTopic(BaseModelMixin):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
