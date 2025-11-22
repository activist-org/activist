# SPDX-License-Identifier: AGPL-3.0-or-later

# mypy: ignore-errors

from typing import Any, Dict, List, Tuple

from communities.groups.factories import (
    GroupFactory,
    GroupFaqFactory,
    GroupResourceFactory,
    GroupSocialLinkFactory,
    GroupTextFactory,
)
from communities.groups.models import Group
from content.models import Topic


def create_org_groups(
    *,
    user,
    user_topic: Topic,
    user_topic_name: str,
    user_org,
    assigned_groups: List[Dict[str, Any]],
    num_groups_per_org: int,
    num_faq_entries_per_entity: int,
    num_resources_per_entity: int,
) -> Tuple[List[Group], int, int, int]:
    """
    Create groups for `user_org` and return:
      (list_of_groups, n_social_links_created, n_resources_created, n_faq_entries_created)

    - `assigned_groups` is the per-org 'groups' list from the org spec (may be []).
    - The helper uses entries from `assigned_groups` when present, otherwise falls back.
    """
    groups: List[Group] = []
    n_social = 0
    n_resources = 0
    n_faq = 0

    for g in range(num_groups_per_org):
        spec = (
            assigned_groups[g]
            if (assigned_groups and g < len(assigned_groups))
            else None
        )

        group_id = (
            spec.get("group_name")
            if spec and "group_name" in spec
            else f"{user_org.org_name}:g{g}"
        )
        group_name = (
            spec.get("name")
            if spec and "name" in spec
            else f"{user_topic_name} Group {g}"
        )
        tagline = (
            spec.get("tagline")
            if spec and "tagline" in spec
            else f"Fighting for {user_topic_name.lower()}"
        )

        user_org_group = GroupFactory(
            created_by=user,
            group_name=group_id,
            name=group_name,
            org=user_org,
            tagline=tagline,
        )

        # texts
        texts_spec = spec.get("texts", {}) if spec else {}
        group_texts = GroupTextFactory(iso="en", primary=True, **texts_spec)
        user_org_group.texts.set([group_texts])

        # social links
        links_spec = spec.get("social_links", []) if spec else []
        if links_spec:
            links = [GroupSocialLinkFactory(**link) for link in links_spec]
            n_social += len(links_spec)
        else:
            links = [
                GroupSocialLinkFactory(label=f"Social Link {s}", order=s)
                for s in range(3)
            ]
            n_social += 3
        user_org_group.social_links.set(links)

        # faqs
        faqs_spec = spec.get("faqs", []) if spec else []
        if faqs_spec:
            faqs = [
                GroupFaqFactory(group=user_org_group, order=i, **faqs_spec[i])
                for i in range(len(faqs_spec))
            ]
            n_faq += len(faqs_spec)
        else:
            faqs = [
                GroupFaqFactory(group=user_org_group, order=i)
                for i in range(num_faq_entries_per_entity)
            ]
            n_faq += num_faq_entries_per_entity
        user_org_group.faqs.set(faqs)

        # resources
        resources_spec = spec.get("resources", []) if spec else []
        if resources_spec:
            for i in range(len(resources_spec)):
                user_org_group.resources.add(
                    GroupResourceFactory(
                        created_by=user,
                        group=user_org_group,
                        order=i,
                        **resources_spec[i],
                    )
                )
                n_resources += 1
        else:
            for i in range(num_resources_per_entity):
                res = GroupResourceFactory(
                    created_by=user, group=user_org_group, order=i
                )
                user_org_group.resources.add(res)
                try:
                    res.topics.set([user_topic])
                except Exception:
                    pass
                n_resources += 1

        groups.append(user_org_group)

    return groups, n_social, n_resources, n_faq
