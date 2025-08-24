# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the authentication app.
"""

from __future__ import annotations

import logging
from typing import Any
from uuid import uuid4

from django.contrib.auth.models import (
    AbstractUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models

logger = logging.getLogger(__name__)

# MARK: Account Manager


class CustomAccountManager(BaseUserManager["UserModel"]):
    """
    Custom manager for creating users and superusers.

    Notes
    -----
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
        logger.info(f"Creating superuser with username: {username}, email: {email}")

        other_fields.setdefault("is_staff", True)
        other_fields.setdefault("is_superuser", True)
        other_fields.setdefault("is_active", True)

        if other_fields.get("is_staff") is not True:
            logger.error(
                f"Superuser creation failed for {username}: is_staff must be True"
            )
            raise ValueError("Superuser must be assigned to is_staff=True.")

        if other_fields.get("is_superuser") is not True:
            logger.error(
                f"Superuser creation failed for {username}: is_superuser must be True"
            )
            raise ValueError("Superuser must be assigned to is_superuser=True.")

        try:
            superuser = self.create_user(
                email=email, username=username, password=password, **other_fields
            )
            logger.info(f"Superuser created successfully: {username}")
            return superuser

        except Exception as e:
            logger.exception(f"Failed to create superuser {username}: {str(e)}")
            raise

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
        logger.info(f"Creating user with username: {username}, email: {email}")

        if email != "":
            email = self.normalize_email(email)

        try:
            user = self.model(email=email, username=username, **other_fields)
            user.set_password(password)
            user.save()
            logger.info(f"User created successfully: {username}")
            return user
        except Exception as e:
            logger.exception(f"Failed to create user {username}: {str(e)}")
            raise


# MARK: Support


class SupportEntityType(models.Model):
    """
    Represents a type of support entity, such as organization, group, event, or user.

    Notes
    -----
    This model is used in the `Support` relationship to define the type of entity
    involved in the support system.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class Support(models.Model):
    """
    Represents a support relationship between two entities.

    Notes
    -----
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
        return str(self.id)


# MARK: Session


class SessionModel(models.Model):
    """
    Represents a user session.

    Notes
    -----
    This model is used to track user sessions for authentication and activity logging.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Session {self.id} for {self.user.username}"


# MARK: User


class UserModel(AbstractUser, PermissionsMixin):
    """
    Custom user model for authentication.

    Notes
    -----
    Extends Django's `AbstractUser` and adds platform-specific fields (default username, password and email used).
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True)
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
    is_confirmed = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    is_high_risk = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)

    # Django specific fields.
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects: CustomAccountManager = CustomAccountManager()  # type: ignore

    USERNAME_FIELD = "username"

    resources = models.ManyToManyField("content.Resource", blank=True)
    social_links = models.ManyToManyField("content.SocialLink", blank=True)
    tasks = models.ManyToManyField("content.Task", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    flags = models.ManyToManyField(
        "self",
        through="authentication.UserFlag",
    )

    def __str__(self) -> str:
        return self.username


class UserFlag(models.Model):
    """
    Model for users who are flagged.
    """

    id = models.UUIDField(primary_key=True, editable=False, default=uuid4)
    user = models.ForeignKey(
        "authentication.UserModel",
        on_delete=models.CASCADE,
        related_name="flagged_user",
    )
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now=True)
