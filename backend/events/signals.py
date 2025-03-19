# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="attr-defined"
from typing import Any

from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from core.settings import EVENT_LIST_CACHE_PREFIX, EVENT_RETRIEVE_CACHE_PREFIX
from events.models import Event


@receiver([post_delete, post_save], sender=Event)
def invalidate_event_cache(sender : Event, **kwargs : Any) -> None:
    print("Invalidating Event cache")

    keys_to_delete = cache.keys(f"*{EVENT_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{EVENT_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)
