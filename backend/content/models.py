"""
Content Models

This file contains models for the content app.

Contents:
    - Discussion
    - DiscussionEntry
    - Faq
    - Resource
    - Task
    - Topic
    - Tag
    - ResourceTopic
    - ResourceTag
    - TopicFormat
    - DiscussionTag
    - Image
"""

from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.core.validators import validate_image_file_extension
from django.db import models

from backend.mixins.models import CreationDeletionMixin


class Discussion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    org_id = models.ForeignKey("entities.Organization", on_delete=models.CASCADE)
    group_id = models.ForeignKey("entities.Group", on_delete=models.CASCADE)
    # movement_id = models.ForeignKey("entities.Movement", on_delete=models.CASCADE)  # To be created
    event_id = models.ForeignKey("events.Event", on_delete=models.CASCADE)
    # vote_id = models.ForeignKey("events.Vote", on_delete=models.CASCADE)  # To be created
    category = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.id}"


class DiscussionEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    discussion_id = models.ForeignKey(Discussion, on_delete=models.CASCADE)
    created_by = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    text = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.id}"


class Faq(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    org_id = models.ForeignKey("entities.Organization", on_delete=models.CASCADE)
    question = models.TextField(max_length=500)
    answer = models.TextField(max_length=500)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.question


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    topics = ArrayField(models.CharField(max_length=255), default=list, blank=True)
    category = models.CharField(max_length=255, blank=True)
    url = models.URLField(max_length=255)
    private = models.BooleanField(default=True)
    created_by = models.ForeignKey("authentication.User", on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Task(CreationDeletionMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    tags = ArrayField(models.CharField(max_length=255), default=list, blank=True)

    def __str__(self) -> str:
        return self.name


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    id = models.IntegerField(primary_key=True)
    text = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"


class ResourceTopic(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class ResourceTag(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class TopicFormat(models.Model):
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id = models.ForeignKey("events.Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


# class DiscussionTag(models.Model):
#     discussion_id = models.ForeignKey(Discussion, on_delete=models.CASCADE)
#     tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)

#     def __str__(self) -> str:
#         return f"{self.id}"


class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    image_location = models.ImageField(
        upload_to="images/", validators=[validate_image_file_extension]
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.id}"
