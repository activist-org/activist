# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the events app.
"""

from typing import Any
from uuid import uuid4

from django.db import models

from content.models import Faq, SocialLink
from utils.models import ISO_CHOICES

# MARK: Event


class Event(models.Model):
    """
    Base event model.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_events",
        on_delete=models.CASCADE,
    )
    orgs = models.ForeignKey(
        "communities.Organization", related_name="events", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    icon_url = models.ForeignKey(
        "content.Image", on_delete=models.CASCADE, blank=True, null=True
    )
    TYPE_CHOICES = [
        ("learn", "Learn"),
        ("action", "Action"),
    ]
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    SETTING_CHOICES = [
        ("online", "Online"),
        ("offline", "Offline"),
    ]
    setting = models.CharField(max_length=255, choices=SETTING_CHOICES)
    online_location_link = models.CharField(max_length=255, blank=True)
    offline_location = models.OneToOneField(
        "content.Location", on_delete=models.CASCADE, null=False, blank=False
    )
    get_involved_url = models.URLField(blank=True)
    is_private = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    terms_checked = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    resources = models.ManyToManyField("content.Resource", blank=True)
    discussions = models.ManyToManyField("content.Discussion", blank=True)
    formats = models.ManyToManyField("events.Format", blank=True)
    roles = models.ManyToManyField("events.Role", blank=True)
    tags = models.ManyToManyField("content.Tag", blank=True)
    tasks = models.ManyToManyField("content.Task", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    # Explicit type annotation required for mypy compatibility with django-stubs.
    flags: Any = models.ManyToManyField("authentication.UserModel", through="EventFlag")

    def __str__(self) -> str:
        return self.name


# MARK: Event Flag


class EventFlag(models.Model):
    """
    Model for event flags.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    event = models.ForeignKey("Event", on_delete=models.CASCADE)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now=True)


# MARK: Format


class Format(models.Model):
    """
    Standardized event formats.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


# MARK: Role


class Role(models.Model):
    """
    Event roles for users.
    """

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
    """
    Link events and users including roles and attendance status.
    """

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="event_attendees"
    )
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    role = models.ForeignKey(
        "events.Role", on_delete=models.CASCADE, blank=True, null=True
    )
    attendee_status = models.ForeignKey(
        "EventAttendeeStatus", on_delete=models.CASCADE, default=1
    )

    def __str__(self) -> str:
        return f"{self.user} - {self.event}"


class EventAttendeeStatus(models.Model):
    """
    Attendance statuses for users to events.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class EventSocialLink(SocialLink):
    """
    Extension of the base SocialLink model for events.
    """

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=True, related_name="social_links"
    )


class EventFaq(Faq):
    """
    Class for adding faq parameters to events.
    """

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=True, related_name="faqs"
    )


class EventText(models.Model):
    """
    Translatable text content for events in different languages.
    """

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=True, related_name="texts"
    )
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=2500)
    get_involved = models.TextField(max_length=500, blank=True)

    def __str__(self) -> str:
        return f"{self.event} - {self.iso}"
