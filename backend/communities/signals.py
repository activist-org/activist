# SPDX-License-Identifier: AGPL-3.0-or-later
# mypy: disable-error-code="attr-defined"
from typing import Any

from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from communities.groups.models import Group
from communities.organizations.models import Organization
from core.settings import (
    GROUP_LIST_CACHE_PREFIX,
    GROUP_RETRIEVE_CACHE_PREFIX,
    ORGANIZATION_LIST_CACHE_PREFIX,
    ORGANIZATION_RETRIEVE_CACHE_PREFIX,
)


@receiver([post_delete, post_save], sender=Group)
def invalidate_group_cache(sender : Group, **kwargs : Any) -> None:
    print("Invalidating Group cache")

    keys_to_delete = cache.keys(f"*{GROUP_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{GROUP_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)


@receiver([post_delete, post_save], sender=Organization)
def invalidate_organization_cache(sender : Organization, **kwargs : Any) -> None:
    print("Invalidating Organization cache")

    keys_to_delete = cache.keys(f"*{ORGANIZATION_LIST_CACHE_PREFIX}*") + cache.keys(
        f"*{ORGANIZATION_RETRIEVE_CACHE_PREFIX}*"
    )
    cache.delete_many(keys_to_delete)
