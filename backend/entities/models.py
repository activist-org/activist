"""
Entities Models

This file contains models for the entities app.

Contents:
    - Organization
    - OrganizationApplicationStatus
    - OrganizationApplication
    - OrganizationEvent
    - OrganizationMember
    - OrganizationResource
    - Group
    - OrganizationTask
    - OrganizationTopic
    - GroupEvent
    - GroupMember
    - GroupResource
    - GroupTopic
"""
from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import CreationDeletionMixin


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    tagline = models.CharField(max_length=255, blank=True)
    created_by = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    description = models.TextField(max_length=500)
    social_accounts = ArrayField(
        models.CharField(max_length=255), default=list, blank=True
    )
    high_risk = models.BooleanField(default=False)
    status = models.ForeignKey("StatusType", on_delete=models.CASCADE, default=1)
    status_updated = models.DateTimeField(blank=True, null=True)
    acceptance_date = models.DateTimeField(blank=True, null=True)
    deletion_date = models.DateTimeField(blank=True, null=True)
    total_flags = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.name


class OrganizationApplication(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    status = models.ForeignKey(
        "OrganizationApplicationStatus", on_delete=models.CASCADE, default=1
    )
    orgs_in_favor = ArrayField(
        models.IntegerField(null=True, blank=True), default=list, blank=True
    )
    orgs_against = ArrayField(
        models.IntegerField(null=True, blank=True), default=list, blank=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    status_updated = models.DateTimeField(auto_now=True)
    status = models.ForeignKey("StatusType", on_delete=models.CASCADE, default=1)

    def __str__(self) -> str:
        return f"{self.creation_date}"


class OrganizationEvent(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationMember(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationResource(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class Group(CreationDeletionMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(max_length=500)
    social_accounts = ArrayField(
        models.CharField(max_length=255), default=list, blank=True
    )
    created_by = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    category = models.CharField(max_length=255)
    total_flags = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.name


class OrganizationTask(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)
    group_id = models.ForeignKey(
        "Group", on_delete=models.CASCADE, null=True, blank=True
    )

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationTopic(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupEvent(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupMember(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupResource(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupTopic(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class Status(models.Model):
    status_type = models.ForeignKey("StatusType", on_delete=models.CASCADE)
    org_id = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="org_status"
    )
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.org_id.name} - {self.status_type.name}"


class StatusType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
