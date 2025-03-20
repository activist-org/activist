# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="attr-defined"
from typing import Any

from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from content.models import Discussion, DiscussionEntry, Resource
from core.settings import (
    DISCUSSION_LIST_CACHE_PREFIX,
    DISCUSSION_RETRIEVE_CACHE_PREFIX,
    DISCUSSIONENTRY_LIST_CACHE_PREFIX,
    DISCUSSIONENTRY_RETRIEVE_CACHE_PREFIX,
    RESOURCE_LIST_CACHE_PREFIX,
    RESOURCE_RETRIEVE_CACHE_PREFIX,
)


@receiver([post_delete, post_save], sender=Discussion)
def invalidate_discussion_cache(sender : Discussion, **kwargs : Any) -> None:
    print("Invalidating Discussion cache")

    keys_to_delete = cache.keys(f"*{DISCUSSION_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{DISCUSSION_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)


@receiver([post_delete, post_save], sender=DiscussionEntry)
def invalidate_discussion_entry_cache(sender : DiscussionEntry, **kwargs : Any) -> None:
    print("Invalidating DiscussionEntry cache")

    keys_to_delete = cache.keys(f"*{DISCUSSIONENTRY_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{DISCUSSIONENTRY_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)


@receiver([post_delete, post_save], sender=Resource)
def invalidate_resource_cache(sender : Resource, **kwargs : Any) -> None:
    print("Invalidating Resource cache")

    keys_to_delete = cache.keys(f"*{RESOURCE_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{RESOURCE_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)
