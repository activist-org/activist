"""
Models for the events app.
"""

from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import CreationDeletionMixin

# MARK: Main Tables


class Event(CreationDeletionMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_events",
        on_delete=models.CASCADE,
    )
    icon_url = models.ForeignKey(
        "content.Image", on_delete=models.CASCADE, blank=True, null=True
    )
    type = models.CharField(max_length=255)
    online_location_link = models.CharField(max_length=255, blank=True)
    offline_location_lat = models.FloatField(null=True, blank=True)
    offline_location_long = models.FloatField(null=True, blank=True)
    get_involved_url = models.URLField(blank=True)
    social_links = ArrayField(
        models.CharField(max_length=255), default=list, blank=True
    )
    is_private = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self) -> str:
        return self.name


class Format(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


class Role(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


# MARK: Bridge Tables


class EventAttendee(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE, null=True, blank=True)
    attendee_status = models.ForeignKey(
        "EventAttendeeStatus", on_delete=models.CASCADE, default=1
    )

    def __str__(self) -> str:
        return f"{self.user_id} - {self.event_id}"


class EventAttendeeStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class EventFormat(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    format_id = models.ForeignKey("Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class EventResource(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class EventRole(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    role_id = models.ForeignKey("Role", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class EventTag(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    tag_id = models.ForeignKey("content.Tag", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class EventTask(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class EventText(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    iso = models.ForeignKey(
        "content.ISOCodeMap", on_delete=models.CASCADE, related_name="iso_code"
    )
    primary = models.BooleanField()
    description = models.TextField(max_length=500)
    get_involved = models.TextField(max_length=500, blank=True)

    def __str__(self) -> str:
        return f"{self.id}"


class EventTopic(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"
