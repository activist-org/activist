"""
Models for the events app.
"""

from uuid import uuid4

from django.db import models

from utils.models import ISO_CHOICES

# MARK: Main Tables


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_events",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    icon_url = models.ForeignKey(
        "content.Image", on_delete=models.CASCADE, blank=True, null=True
    )
    type = models.CharField(max_length=255)
    online_location_link = models.CharField(max_length=255, blank=True)
    offline_location = models.OneToOneField(
        "content.Location", on_delete=models.CASCADE, null=False, blank=False
    )
    get_involved_url = models.URLField(blank=True)
    is_private = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)
    texts = models.ForeignKey(
        "EventText", on_delete=models.CASCADE, blank=True, null=True
    )

    resources = models.ManyToManyField("content.Resource", blank=True)
    dicussions = models.ManyToManyField("content.Discussion", blank=True)
    faqs = models.ManyToManyField("content.Faq", blank=True)
    formats = models.ManyToManyField("events.Format", blank=True)
    roles = models.ManyToManyField("events.Role", blank=True)
    social_links = models.ManyToManyField("content.SocialLink", blank=True)
    tags = models.ManyToManyField("content.Tag", blank=True)
    tasks = models.ManyToManyField("content.Task", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    def __str__(self) -> str:
        return self.name


class Format(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
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
    event_id = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="event_attendees"
    )
    user_id = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    role_id = models.ForeignKey(
        "events.Role", on_delete=models.CASCADE, blank=True, null=True
    )
    attendee_status = models.ForeignKey(
        "EventAttendeeStatus", on_delete=models.CASCADE, default=1
    )

    def __str__(self) -> str:
        return f"{self.user_id} - {self.event_id}"


class EventAttendeeStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class EventText(models.Model):
    event_id = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=2500)
    get_involved = models.TextField(max_length=500, blank=True)

    def __str__(self) -> str:
        return f"{self.id}"
