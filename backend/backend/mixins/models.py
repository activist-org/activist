import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class BaseModelMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class ModelMixin(BaseModelMixin):
    created_by = models.ForeignKey(
        "authentication.User",
        verbose_name=_("Created by"),
        on_delete=models.SET_NULL,
        editable=False,
        null=True,
        related_name="created_%(class)s_set",
    )
    modified_by = models.ForeignKey(
        "authentication.User",
        verbose_name=_("Modified by"),
        on_delete=models.SET_NULL,
        editable=False,
        null=True,
        related_name="modified_%(class)s_set",
    )
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("Modified at"), auto_now=True)
    deleted_at = models.DateTimeField(_("Deleted at"), null=True, blank=True)

    class Meta:
        abstract = True
