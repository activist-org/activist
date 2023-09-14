"""
Events Models

This file contains models for the events app.

TODO: All fields have on_delete=models.CASCADE: this needs to be reviewed, as SET_NULL is preferable in many cases.

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

import uuid

from django.db import models


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    get_involved_text = models.TextField(max_length=500)
    online_location_link = models.CharField(max_length=255)
    offline_location_name = models.CharField(max_length=255)
    offline_location_lat = models.FloatField(null=True)
    offline_location_long = models.FloatField(null=True)
    start_time = models.DateField(null=True)
    end_time = models.DateField(null=True)
    created_by = models.ForeignKey(
        "authentication.User", related_name="created_events", on_delete=models.CASCADE
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self) -> str:
        return self.name


class Format(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    def __str__(self) -> str:
        return self.name


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateField(null=True)

    def __str__(self) -> str:
        return self.name


class EventAttendee(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE)
    attendee_status = models.IntegerField(null=True)


class EventFormat(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    format_id = models.ForeignKey("Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventAttendeeStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class EventResource(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventRole(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventTask(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class EventTopic(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
