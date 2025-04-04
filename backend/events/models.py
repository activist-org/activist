# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for event management and organization.
"""

from uuid import uuid4

from django.db import models

from content.models import SocialLink
from utils.models import ISO_CHOICES

# MARK: Main Tables


class Event(models.Model):
    """
    Event information including timing, location, and organizational data.
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

    resources = models.ManyToManyField("content.Resource", blank=True)
    dicussions = models.ManyToManyField("content.Discussion", blank=True)
    faqs = models.ManyToManyField("content.Faq", blank=True)
    formats = models.ManyToManyField("events.Format", blank=True)
    roles = models.ManyToManyField("events.Role", blank=True)
    tags = models.ManyToManyField("content.Tag", blank=True)
    tasks = models.ManyToManyField("content.Task", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    def __str__(self) -> str:
        """
        Return string representation of the event.

        Parameters
        ----------
        self : Event
            Event instance.

        Returns
        -------
        str
            Event name as string.
        """
        return self.name


class Format(models.Model):
    """
    Standardized event formats like workshop, lecture, protest, rally, etc.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        """
        Return string representation of the format.

        Parameters
        ----------
        self : Format
            Format instance.

        Returns
        -------
        str
            Format name as string.
        """
        return self.name


class Role(models.Model):
    """
    Event roles such as organizer, speaker, volunteer, etc.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        """
        Return string representation of the role.

        Parameters
        ----------
        self : Role
            Role instance.

        Returns
        -------
        str
            Role name as string.
        """
        return self.name


# MARK: Bridge Tables


class EventAttendee(models.Model):
    """
    Link between users and events, tracking roles and attendance status.
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
        """
        Return string representation of the event attendee.

        Parameters
        ----------
        self : EventAttendee
            EventAttendee instance.

        Returns
        -------
        str
            String in format "user - event".
        """
        return f"{self.user} - {self.event}"


class EventAttendeeStatus(models.Model):
    """
    Attendance statuses like confirmed, pending, cancelled, etc.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        """
        Return string representation of the attendee status.

        Parameters
        ----------
        self : EventAttendeeStatus
            EventAttendeeStatus instance.

        Returns
        -------
        str
            Status name as string.
        """
        return self.status_name


class EventSocialLink(SocialLink):
    """
    Extension of the base SocialLink model for events.
    """

    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, null=True, related_name="social_links"
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
        """
        Return string representation of the event text.

        Parameters
        ----------
        self : EventText
            EventText instance.

        Returns
        -------
        str
            String in format "event - iso".
        """
        return f"{self.event} - {self.iso}"
