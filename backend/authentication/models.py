# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the authentication app.
"""

from __future__ import annotations

from typing import Any
from uuid import uuid4

from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

# MARK: Account Manager


class CustomAccountManager(BaseUserManager["UserModel"]):
    """
    Custom manager for creating users and superusers.

    The `create_user` method creates a regular user, while `create_superuser`
    creates a superuser with additional permissions (is_staff, is_superuser).
    """

    def create_superuser(
        self,
        email: str,
        username: str,
        password: str,
        **other_fields: bool,
    ) -> Any:
        """
        Create and return a superuser with given email, username, and password.

        Ensures the superuser has both is_staff and is_superuser set to True.

        Parameters
        ----------
        email : str
            Email of the user.
        username : str
            Username of the user.
        password : str
            Password of the user.
        **other_fields : bool
            Additional fields to set on the user.

        Returns
        -------
        Any
            The created superuser.
        """
        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_staff") is not True:
            raise ValueError("Superuser must be assigned to is_staff=True.")
        if other_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must be assigned to is_superuser=True.")

        return self.create_user(
            email=email, username=username, password=password, **other_fields
        )

    def create_user(
        self,
        username: str,
        password: str,
        email: str = "",
        **other_fields: Any,
    ) -> UserModel:
        """
        Create and return a regular user with the given email, username, and password.

        Parameters
        ----------
        username : str
            Username of the user.
        password : str
            Password of the user.
        email : str
            Email of the user.
        **other_fields : Any
            The other_fields of the user.

        Returns
        -------
        UserModel
            The created user.
        """
        if email != "":
            email = self.normalize_email(email)

        user = self.model(email=email, username=username, **other_fields)
        user.set_password(password)
        user.save()
        return user


# MARK: Support


class SupportEntityType(models.Model):
    """
    Represents a type of support entity, such as organization, group, event, or user.

    This model is used in the `Support` relationship to define the type of entity
    involved in the support system.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        """
        Return the string representation of the entity type.

        Returns
        -------
        str
            The string representation of the entity type.
        """
        return self.name


class Support(models.Model):
    """
    Represents a support relationship between two entities.

    A `Support` connects a supporter entity (like an organization) to a supported entity.
    Both entities are represented by their type and specific instances.
    """

    supporter_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supporter"
    )
    supporter_entity = models.ForeignKey(
        "communities.Organization",
        on_delete=models.CASCADE,
        related_name="supporter",
    )
    supported_type = models.ForeignKey(
        "SupportEntityType", on_delete=models.CASCADE, related_name="supported"
    )
    supported_entity = models.ForeignKey(
        "communities.Organization",
        on_delete=models.CASCADE,
        related_name="supported",
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        """
        Return the string representation of the support instance (ID).

        Returns
        -------
        str
            The string representation of the support instance.
        """
        return str(self.id)


# MARK: User


class UserModel(AbstractUser, PermissionsMixin):
    """
    Custom user model for authentication.

    Extends Django's `AbstractUser` and adds custom fields for handling
    user attributes such as location, description, verification, etc.

    This model includes:
    - Fields for user personal info, like `username`, `name`, `location`.
    - Fields for verification details, like `verified`, `verification_code`.
    - Security fields, including `password`, `is_private`, `is_high_risk`.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, blank=True)
    password = models.CharField(max_length=255)
    location = models.CharField(max_length=100, blank=True)
    description = models.TextField(max_length=500, blank=True)
    verified = models.BooleanField(default=False)
    verification_method = models.CharField(max_length=30, blank=True)
    verification_partner = models.ForeignKey(
        "authentication.UserModel", on_delete=models.SET_NULL, null=True
    )
    verification_code = models.UUIDField(blank=True, null=True)
    icon_url = models.ForeignKey(
        "content.Image", on_delete=models.SET_NULL, blank=True, null=True
    )
    email = models.EmailField(blank=True)
    is_confirmed = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_high_risk = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)

    # Django specific fields
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects: CustomAccountManager = CustomAccountManager()  # type: ignore

    USERNAME_FIELD = "username"

    resources = models.ManyToManyField("content.Resource", blank=True)
    social_links = models.ManyToManyField("content.SocialLink", blank=True)
    tasks = models.ManyToManyField("content.Task", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    def __str__(self) -> str:
        """
        Return the string representation of the user by their username.

        Returns
        -------
        str
            The user's username.
        """
        return self.username
