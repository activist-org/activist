# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Models for the content app.
"""

import logging
import os
from typing import Any, Type
from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.core.validators import validate_image_file_extension
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver

from utils.models import ISO_CHOICES

# MARK: Discussion


class Discussion(models.Model):
    """
    Discussion model for community conversations.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)
    tags = models.ManyToManyField("content.Tag", blank=True)

    def __str__(self) -> str:
        return str(self.id)


# MARK: Discussion Entry


class DiscussionEntry(models.Model):
    """
    DiscussionEntry model for individual posts within a discussion.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    discussion = models.ForeignKey(
        "content.Discussion", on_delete=models.CASCADE, related_name="discussion_entry"
    )
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    text = models.CharField(max_length=255, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deletion_date = models.DateTimeField(blank=True, null=True)

    def __str__(self) -> str:
        return str(self.id)


# MARK: FAQ


class Faq(models.Model):
    """
    Frequently Asked Questions model.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    iso = models.CharField(max_length=3, choices=ISO_CHOICES)
    primary = models.BooleanField(default=False)
    question = models.TextField(max_length=500)
    answer = models.TextField(max_length=500)
    order = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.question


# MARK: Image


def set_filename_to_uuid(instance: Any, filename: str) -> str:
    """
    Generate a new filename using the model's UUID and keep the original extension.

    Parameters
    ----------
    instance : Any
        The model instance that the file is being attached to.

    filename : str
        The original filename of the uploaded file.

    Returns
    -------
    str
        The new file path with UUID-based filename.

    Notes
    -----
    This function is used to maintain unique filenames and prevent collisions.
    File extensions are forced to lowercase for consistency.
    """
    logger = logging.getLogger(__name__)
    try:
        ext = os.path.splitext(filename)[1]  # extract file extension
        # Note: Force extension to lowercase.
        new_filename = f"{instance.id}{ext.lower()}"  # use model UUID as filename
        result = os.path.join("images/", new_filename)  # store in 'images/' folder
        logger.debug(f"Generated new filename for upload: {result}")
        return result
    except Exception:
        logger.exception(f"Failed to generate filename for upload: {filename}")
        raise


class Image(models.Model):
    """
    Image model for storing uploaded images.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    file_object = models.ImageField(
        upload_to=set_filename_to_uuid,
        validators=[validate_image_file_extension],
    )
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.id)


@receiver(post_delete, sender=Image)
def delete_image_file(sender: Type[Image], instance: Image, **kwargs: Any) -> None:
    """
    Delete the file from the filesystem when the Image instance is deleted.

    Parameters
    ----------
    sender : Type[Image]
        The model class that sent the signal.

    instance : Image
        The actual instance being deleted.

    **kwargs : Any
        Additional keyword arguments passed to the receiver.

    Notes
    -----
    This signal handler prevents orphaned files in the filesystem
    when Image model instances are deleted.
    """
    logger = logging.getLogger(__name__)
    if instance.file_object:
        try:
            instance.file_object.delete(save=False)
            logger.info(f"Deleted image file for Image instance {instance.id}")
        except Exception:
            logger.exception(
                f"Failed to delete image file for Image instance {instance.id}"
            )


# MARK: Location


class Location(models.Model):
    """
    Location model for geographic data.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    lat = models.CharField(max_length=24)
    lon = models.CharField(max_length=24)
    bbox = ArrayField(
        base_field=models.CharField(max_length=24), size=4, blank=True, null=True
    )
    display_name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return str(self.id)


# MARK: Resource


class Resource(models.Model):
    """
    Resource model for sharing useful links and information.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    created_by = models.ForeignKey(
        "authentication.UserModel",
        on_delete=models.CASCADE,
        related_name="created_resource",
    )
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    category = models.CharField(max_length=255, blank=True)
    location = models.OneToOneField(
        "content.Location", on_delete=models.CASCADE, null=False, blank=False
    )
    url = models.URLField(max_length=255)
    is_private = models.BooleanField(default=True)
    terms_checked = models.BooleanField(default=False)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    tags = models.ManyToManyField("content.Tag", blank=True)
    topics = models.ManyToManyField("content.Topic", blank=True)

    # Explicit type annotation required for mypy compatibility with django-stubs.
    flags: Any = models.ManyToManyField(
        "authentication.UserModel",
        through="ResourceFlag",
    )

    def __str__(self) -> str:
        return self.name


class ResourceFlag(models.Model):
    """
    Model for flagged resources.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    resource = models.ForeignKey("content.Resource", on_delete=models.CASCADE)
    created_by = models.ForeignKey("authentication.UserModel", on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now=True)


# MARK: Social Link


class SocialLink(models.Model):
    """
    SocialLink model for storing links to social media profiles.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    link = models.CharField(max_length=255)
    label = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.label


# MARK: Tag


class Tag(models.Model):
    """
    Tag model for content categorization.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    text = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return str(self.id)


# MARK: Task


class Task(models.Model):
    """
    Task model for tracking actionable items.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=500)
    last_updated = models.DateTimeField(auto_now=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    deletion_date = models.DateTimeField(blank=True, null=True)
    tag = models.ManyToManyField("content.Tag", blank=True)

    def __str__(self) -> str:
        return self.name


# MARK: Topic


class Topic(models.Model):
    """
    Topic model for categorizing content by subject matter.
    """

    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    description = models.TextField(max_length=500)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    deprecation_date = models.DateTimeField(blank=True, null=True)

    format = models.ManyToManyField("events.Format", blank=True)

    def __str__(self) -> str:
        return self.name
