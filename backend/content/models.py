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

from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import BaseModelMixin, ModelMixin


class Resource(ModelMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True)
    topics = ArrayField(models.CharField(max_length=255), null=True)
    location = models.CharField(max_length=255, null=True)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField(default=0)
    private = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Task(ModelMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    location = models.CharField(max_length=255, null=True)
    tags = ArrayField(models.CharField(max_length=255), null=True)

    def __str__(self) -> str:
        return self.name


class Topic(ModelMixin):
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)
    deprecation_date = models.DateTimeField(null=True)

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
