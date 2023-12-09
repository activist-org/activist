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

from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import BaseModelMixin, ModelMixin


class SupportEntityType(BaseModelMixin):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Support(BaseModelMixin):
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


class User(AbstractUser, ModelMixin):
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
    private = models.BooleanField(default=False)
    high_risk = models.BooleanField(default=False)
    total_flags = models.IntegerField(default=0)

    def __str__(self) -> str:
        return self.username


class UserResource(BaseModelMixin):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    resource_id = models.ForeignKey(
        "content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class UserTask(BaseModelMixin):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)


class UserTopic(BaseModelMixin):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return str(self.id)
