"""
Content Models

This file contains models for the content app.

Contents:
    - Resource
    - Task
    - Topic
    - ResourceTopic
    - TopicFormat
"""

import uuid

from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.backend.mixins.models import ModelMixin, BaseModelMixin


class Resource(ModelMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    topics = ArrayField(models.CharField(max_length=255))
    location = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField(null=True)
    private = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateField(null=True)

    def __str__(self) -> str:
        return self.name


class Task(ModelMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    location = models.CharField(max_length=255)
    tags = ArrayField(models.CharField(max_length=255))

    def __str__(self) -> str:
        return self.name


class Topic(ModelMixin):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)

    def __str__(self) -> str:
        return self.name


class ResourceTopic(BaseModelMixin):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class TopicFormat(BaseModelMixin):
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id = models.ForeignKey("events.Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
