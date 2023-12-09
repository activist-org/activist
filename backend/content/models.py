"""
Content Models

This file contains models for the content app.

TODO: All fields have on_delete=models.CASCADE: this needs to be reviewed, as SET_NULL is preferable in many cases.
TODO: In some/most cases a "ManyToManyField" may be more suitable and scalable than "ArrayField"

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


class Resource(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500, null=True)
    topics = ArrayField(models.CharField(max_length=255), null=True)
    location = models.CharField(max_length=255, null=True)
    url = models.CharField(max_length=255)
    total_flags = models.IntegerField(default=0)
    private = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self) -> str:
        return self.name


class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    location = models.CharField(max_length=255, null=True)
    tags = ArrayField(models.CharField(max_length=255), null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(auto_now=True, null=True)

    def __str__(self) -> str:
        return self.name


class Topic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return self.name


class ResourceTopic(models.Model):
    resource_id = models.ForeignKey(Resource, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class TopicFormat(models.Model):
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)
    format_id = models.ForeignKey("events.Format", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
