"""
Authentication Models

This file contains models for the authentication app.

Contents:
    - SupportEntityType
    - Support
    - User
    - UserResource
    - UserTask
    - UserTopic
"""

from uuid import uuid4

from django.contrib.auth.models import AbstractUser
from django.db import models

from backend.mixins.models import CreationDeletionMixin


class SupportEntityType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Support(models.Model):
    supporter_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supporter"
    )
    supporter_entity = models.ForeignKey(
        "entities.Organization", on_delete=models.CASCADE, related_name="supporter"
    )
    supported_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supported"
    )
    supported_entity = models.ForeignKey(
        "entities.Organization", on_delete=models.CASCADE, related_name="supported"
    )

    def __str__(self) -> str:
        return f"{self.id}"


class User(AbstractUser, CreationDeletionMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user_name = models.CharField(max_length=255)
    name = models.CharField(max_length=255, blank=True)
    password = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, blank=True)
    verification_partner = models.ForeignKey(
        "User", on_delete=models.SET_NULL, null=True
    )
    private = models.BooleanField(default=False)
    high_risk = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username


class UserResource(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class UserTask(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class UserTopic(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"
