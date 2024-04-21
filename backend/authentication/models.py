"""
Authentication Models

This file contains models for the authentication app.

Contents:
    - SupportEntityType
    - Support
    - UserModel
    - UserResource
    - UserTask
    - UserTopic
"""

from typing import Any
from uuid import uuid4

from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
    PermissionsMixin,
    User,
)
from django.contrib.postgres.fields import ArrayField
from django.db import models

from backend.mixins.models import CreationDeletionMixin


class SupportEntityType(models.Model):
    id = models.IntegerField(primary_key=True)
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


class CustomAccountManager(BaseUserManager[User]):
    def create_superuser(
        self,
        email: str,
        username: str,
        password: str,
        **other_fields: bool,
    ) -> Any:
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_staff") is not True:
            raise ValueError("Superuser must be assigned to is_staff=True.")
        if other_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must be assigned to is_superuser=True.")

        return self.create_user(email, username, password, **other_fields)

    def create_user(
        self,
        email: str,
        username: str,
        password: str,
        **other_fields: bool,
    ) -> User:
        if not email:
            raise ValueError(("You must provide an email address"))

        email = self.normalize_email(email)
        user: User = self.model(email=email, username=username, **other_fields)
        user.set_password(password)
        user.save()
        return user


class UserModel(AbstractUser, PermissionsMixin, CreationDeletionMixin):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True)
    password = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, blank=True)
    verification_partner = models.ForeignKey(
        "authentication.UserModel", on_delete=models.SET_NULL, null=True
    )
    user_icon = models.ForeignKey("content.Image", on_delete=models.SET_NULL, null=True)
    email = models.EmailField(unique=True)
    social_accounts = ArrayField(
        models.CharField(max_length=255), blank=True, null=True
    )
    private = models.BooleanField(default=False)
    high_risk = models.BooleanField(default=False)

    objects = CustomAccountManager()  # type: ignore

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def __str__(self) -> str:
        return self.username


class UserResource(models.Model):
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    resource_id = models.ForeignKey("content.Resource", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class UserTask(models.Model):
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    task_id = models.ForeignKey("content.Task", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"


class UserTopic(models.Model):
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    topic_id = models.ForeignKey("content.Topic", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.id}"
