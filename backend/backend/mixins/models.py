import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class IdMixin(models.Model):
    """
    Mixin for models with incrementing Integer primary key
    ------------------------------------------------------

    This mixin is used for models that have an incrementing Integer primary key.
    Default in django is an incrementing Integer primary key. Creating this explicity helps with code highlighting.
    """

    id = models.AutoField(primary_key=True)

    class Meta:
        abstract = True


class UUIDModelMixin(models.Model):
    """Mixin for models with UUID primary key"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class CreationDeletionMixin(models.Model):
    """Mixin for model with creation and deletion date"""

    creation_date = models.DateTimeField(_("Created at"), auto_now_add=True)
    deletion_date = models.DateTimeField(_("Deletion date"), null=True, blank=True)

    class Meta:
        abstract = True
