"""
Models for the content app.
"""

from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.core.validators import validate_image_file_extension
from django.db import models

from utils.models import ISO_CHOICES

# MARK: Main Tables


class Discussion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.id}"


class Faq(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    question = models.TextField(max_length=500)
    answer = models.TextField(max_length=500)
    order = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.question


class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    file_location = models.ImageField(
        upload_to="images/", validators=[validate_image_file_extension]
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"


class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    lat = models.CharField(max_length=24)
    lon = models.CharField(max_length=24)
    bbox = ArrayField(
        base_field=models.CharField(max_length=24), size=4, blank=True, null=True
    )
    display_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return f"{self.id}"


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    category = models.CharField(max_length=255, blank=True)
    location_id = models.OneToOneField(
        "content.Location", on_delete=models.CASCADE, null=False, blank=False
    )
    url = models.URLField(max_length=255)
    is_private = models.BooleanField(default=True)
    terms_checked = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_custom = models.BooleanField(default=False)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return self.name


class SocialLink(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    link = models.CharField(max_length=255)
    label = models.CharField(max_length=255)
    order = models.IntegerField()
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.label


class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    text = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    last_updated = models.DateTimeField(auto_now=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return self.name


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return self.name


# MARK: Bridge Tables


class DiscussionEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    discussion_id = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    text = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.id}"


class DiscussionTag(models.Model):
    discussion_id = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class ResourceTag(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class ResourceTopic(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class TaskTag(models.Model):
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class TopicFormat(models.Model):
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id = models.ForeignKey("events.Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"
