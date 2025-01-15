# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the communities app.
"""

from uuid import uuid4

from django.db import models

from utils.models import ISO_CHOICES

# MARK: Main Tables


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org = models.ForeignKey(
        "communities.Organization",
        on_delete=models.CASCADE,
        related_name="groups",
        null=True,
    )
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    group_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    location = models.ForeignKey(
        "content.Location", on_delete=models.CASCADE, blank=False, null=False
    )
    category = models.CharField(max_length=255)
    get_involved_url = models.URLField(blank=True)
    terms_checked = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)

    social_links = models.ManyToManyField("content.SocialLink", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)
    faqs = models.ManyToManyField("content.Faq", blank=True)
    events = models.ManyToManyField("events.Event", blank=True)
    resources = models.ManyToManyField("content.Resource", blank=True)

    def __str__(self) -> str:
        return self.name


# MARK: Bridge Tables


class GroupImage(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="images")
    image = models.ForeignKey("content.Image", on_delete=models.CASCADE)
    sequence_index = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.id}"


class GroupMember(models.Model):
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="group_members"
    )
    user = models.ForeignKey(
        "authentication.UserModel",
        on_delete=models.CASCADE,
        related_name="group_members",
    )
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupText(models.Model):
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, null=True, related_name="texts"
    )
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    get_involved = models.TextField(max_length=500, blank=True)
    donate_prompt = models.TextField(max_length=500, blank=True)
