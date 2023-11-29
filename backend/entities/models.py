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

from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import BaseModelMixin, ModelMixin


class Organization(ModelMixin):
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    members = ArrayField(models.IntegerField(null=True, blank=True), blank=True)
    supporters = ArrayField(models.IntegerField(null=True, blank=True), blank=True)
    images_url = ArrayField(models.CharField(max_length=255))
    topics = ArrayField(models.CharField(max_length=255))
    social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)
    high_risk = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.name


class OrganizationApplicationStatus(BaseModelMixin):
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class OrganizationApplication(ModelMixin):
    org_id = models.IntegerField(null=True)
    status = models.ForeignKey(
        "OrganizationApplicationStatus", on_delete=models.CASCADE
    )
    orgs_in_favor = ArrayField(models.IntegerField(null=True, blank=True), blank=True)
    orgs_against = ArrayField(models.IntegerField(null=True, blank=True), blank=True)
    status_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return str(self.created_at)


class OrganizationEvent(BaseModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class OrganizationMember(BaseModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    is_owner = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_comms = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.id)


class OrganizationResource(BaseModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class Group(ModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    social_accounts = ArrayField(models.CharField(max_length=255))
    total_flags = models.IntegerField(null=True)

    def __str__(self) -> str:
        return self.name


class OrganizationTask(BaseModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)
    group_id = models.ForeignKey("Group", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class OrganizationTopic(BaseModelMixin):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class GroupEvent(BaseModelMixin):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class GroupMember(BaseModelMixin):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.id)


class GroupResource(BaseModelMixin):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class GroupTopic(BaseModelMixin):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
