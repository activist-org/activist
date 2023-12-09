import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class BaseModelMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class ModelMixin(BaseModelMixin):
    creation_date = models.DateTimeField(_("Created at"), auto_now_add=True)
    deletion_date = models.DateTimeField(_("Deletion date"), null=True, blank=True)

    class Meta:
        abstract = True
