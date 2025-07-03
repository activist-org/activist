# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the communities app.
"""

from uuid import uuid4

from django.db import models

from authentication import enums
from content.models import SocialLink
from utils.models import ISO_CHOICES

# MARK: Organization


class Organization(models.Model):
    """
    General organization class with all base parameters.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_org",
        on_delete=models.CASCADE,
    )
    org_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    icon_url = models.ForeignKey(
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

    topics = models.ManyToManyField("content.Topic", blank=True)

    resources = models.ManyToManyField("content.Resource", blank=True)
    discussions = models.ManyToManyField("content.Discussion", blank=True)
    flags = models.ManyToManyField(
        "authentication.UserModel",
        through="OrganizationFlag",
    )

    def __str__(self) -> str:
        return self.name


class OrganizationFlag(models.Model):
    """
    Model for flagged organizations.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org = models.ForeignKey("communities.Organization", on_delete=models.CASCADE)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)


# MARK: Bridge Tables


class OrganizationApplication(models.Model):
    """
    Class covering the application of an organization to join the platform.
    """

    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="application"
    )
    status = models.ForeignKey(
        "StatusType", on_delete=models.CASCADE, blank=True, null=True
    )
    orgs_in_favor = models.ManyToManyField(
        "communities.Organization", related_name="in_favor", blank=True
    )
    orgs_against = models.ManyToManyField(
        "communities.Organization", related_name="against", blank=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.creation_date)


class OrganizationApplicationStatus(models.Model):
    """
    Class handling the status of an organization application.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class OrganizationImage(models.Model):
    """
    Class for adding image parameters to organizations.
    """

    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    image = models.ForeignKey("content.Image", on_delete=models.CASCADE)
    sequence_index = models.IntegerField()

    def __str__(self) -> str:
        return str(self.id)


class OrganizationMember(models.Model):
    """
    Class for adding user membership parameters to organizations.
    """

    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.id)


class OrganizationSocialLink(SocialLink):
    """
    Class for adding social link parameters to organizations.
    """

    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, related_name="social_links"
    )


class OrganizationFaq(models.Model):
    """
    Organization Frequently Asked Questions model.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    question = models.TextField(max_length=500)
    answer = models.TextField(max_length=500)
    order = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)
    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, related_name="faqs"
    )

    def __str__(self) -> str:
        return self.question


class OrganizationTask(models.Model):
    """
    Class for adding task parameters to organizations.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    task = models.ForeignKey("content.Task", on_delete=models.CASCADE)
    group = models.ForeignKey(
        "Group", on_delete=models.CASCADE, blank=True, null=True, related_name="groups"
    )

    def __str__(self) -> str:
        return str(self.id)


class OrganizationText(models.Model):
    """
    Class for adding text parameters to organizations.
    """

    org = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, related_name="texts"
    )
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=2500)
    get_involved = models.TextField(max_length=500, blank=True)
    donate_prompt = models.TextField(max_length=500, blank=True)

    def __str__(self) -> str:
        return f"{self.org} - {self.iso}"
