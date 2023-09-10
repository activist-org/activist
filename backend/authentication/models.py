"""
Authentication Models

This file contains models for the authentication app.

TODO: All fields have on_delete=models.CASCADE: this needs to be reviewed, as SET_NULL is preferable in many cases.
TODO: Some relational-models may need to be moved in the "content" app in order to prevent circular dependency issues.

Contents:
    - SupportEntityType
    - Support
    - User
    - UserResource
    - UserTask
    - UserTopic
"""

import uuid

from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models


class SupportEntityType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Support(models.Model):
    supporter_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supporter"
    )
    supporter_entity = models.IntegerField(null=True)
    supported_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supported"
    )
    supported_entity = models.IntegerField(null=True)

    def __str__(self) -> str:
        return str(self.id)


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    location = models.CharField(max_length=30, null=True)
    description = models.TextField(max_length=500, null=True)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, null=True)
    verification_partner = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True, blank=True
    )
    social_accounts = ArrayField(models.CharField(max_length=255), null=True)
    total_flags = models.IntegerField(default=0)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateField(null=True)

    def __str__(self) ->str:
        return self.username


class UserResource(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class UserTask(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class UserTopic(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
