"""
Models for the entities app.
"""

from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.db import models


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    tagline = models.CharField(max_length=255, blank=True)
    icon_url = models.OneToOneField(
        "content.Image", on_delete=models.CASCADE, null=True, blank=True
    )
    created_by = models.ForeignKey(
        "authentication.UserModel",
        related_name="created_orgs",
        on_delete=models.CASCADE,
    )
    description = models.TextField(max_length=500)
    social_links = ArrayField(
        models.CharField(max_length=255), default=list, blank=True
    )
    get_involved_url = models.URLField(blank=True)
    is_high_risk = models.BooleanField(default=False)
    status = models.ForeignKey(
        "StatusType", on_delete=models.CASCADE, default=1, blank=True, null=True
    )
    status_updated = models.DateTimeField(auto_now=True, null=True)
    acceptance_date = models.DateTimeField(null=True, blank=True)
    deletion_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class OrganizationApplicationStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    status_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.status_name


class OrganizationApplication(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    status = models.ForeignKey("StatusType", on_delete=models.CASCADE, default=1)
    orgs_in_favor = models.ManyToManyField(
        "entities.Organization", related_name="in_favor", blank=True
    )
    orgs_against = models.ManyToManyField(
        "entities.Organization", related_name="against", blank=True
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.creation_date}"


class OrganizationEvent(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationImage(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    image_id = models.ForeignKey("content.Image", on_delete=models.CASCADE)
    sequence_index = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.id}"


class OrganizationMember(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
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


class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    tagline = models.CharField(max_length=255, blank=True)
    about_images = models.ManyToManyField(
        "content.Image", related_name="about_img", blank=True
    )
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    get_involved_url = models.URLField(blank=True)
    description = models.TextField(max_length=500)
    social_links = ArrayField(
        models.CharField(max_length=255), default=list, blank=True
    )
    category = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

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


class OrganizationText(models.Model):
    org_id = models.ForeignKey(Organization, on_delete=models.CASCADE)
    iso = models.ForeignKey("content.IsoCodeMap", on_delete=models.CASCADE)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    get_involved = models.TextField(max_length=500)
    donate_prompt = models.TextField(max_length=500)


class GroupEvent(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class GroupImage(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    image_id = models.ForeignKey("content.Image", on_delete=models.CASCADE)
    sequence_index = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.id}"


class GroupMember(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    user_id = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
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


class GroupText(models.Model):
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)
    iso = models.ForeignKey("content.IsoCodeMap", on_delete=models.CASCADE)
    primary = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    get_involved = models.TextField(max_length=500)
    donate_prompt = models.TextField(max_length=500)


class Status(models.Model):
    status_type = models.ForeignKey("StatusType", on_delete=models.CASCADE)
    org_id = models.ForeignKey(
        Organization, on_delete=models.CASCADE, related_name="org_status"
    )
    user_id = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.org_id.name} - {self.status_type}"


class StatusType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
