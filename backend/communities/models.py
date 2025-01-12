# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the communities app.
"""

from uuid import uuid4

from django.db import models

from authentication import enums
from utils.models import ISO_CHOICES

# MARK: Main Tables


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_org",
        on_delete=models.CASCADE,
    )
    org_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    icon_url = models.OneToOneField(
        "content.Image", on_delete=models.CASCADE, blank=True, null=True
    )
    location = models.OneToOneField(
        "content.Location", on_delete=models.CASCADE, null=False, blank=False
    )
    get_involved_url = models.URLField(blank=True)
    terms_checked = models.BooleanField(default=False)
    is_high_risk = models.BooleanField(default=False)
    status = models.ForeignKey(
        "StatusType",
        on_delete=models.CASCADE,
        default=enums.StatusTypes.PENDING.value,
        blank=True,
        null=True,
    )
    status_updated = models.DateTimeField(auto_now=True, null=True)
    acceptance_date = models.DateTimeField(blank=True, null=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    social_links = models.ManyToManyField("content.SocialLink", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)
    faqs = models.ManyToManyField("content.Faq", blank=True)
    resources = models.ManyToManyField("content.Resource", blank=True)
    discussions = models.ManyToManyField("content.Discussion", blank=True)
    groups = models.ManyToManyField("communities.Group", blank=True)
    events = models.ManyToManyField("events.Event", blank=True)

    def __str__(self) -> str:
        return self.name


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="_group"
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


class Status(models.Model):
    status_type = models.ForeignKey("StatusType", on_delete=models.CASCADE)
    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="org_status"
    )
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.org.name} - {self.status_type}"


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


class OrganizationApplication(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    status = models.ForeignKey("StatusType", on_delete=models.CASCADE, default=1)
    orgs_in_favor = models.ManyToManyField(
        "communities.Organization", related_name="in_favor", blank=True
    )
    orgs_against = models.ManyToManyField(
        "communities.Organization", related_name="against", blank=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.creation_date}"


class OrganizationApplicationStatus(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class OrganizationImage(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    image = models.ForeignKey("content.Image", on_delete=models.CASCADE)
    sequence_index = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationMember(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    task = models.ForeignKey("content.Task", on_delete=models.CASCADE)
    group = models.ForeignKey(
        "Group", on_delete=models.CASCADE, blank=True, null=True, related_name="groups"
    )

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationText(models.Model):
    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, related_name="texts"
    )
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=2500)
    get_involved = models.TextField(max_length=500, blank=True)
    donate_prompt = models.TextField(max_length=500, blank=True)


class StatusType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
