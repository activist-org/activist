# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Populate the database with groups for organizations.
"""

# mypy: ignore-errors
import contextlib
from typing import Any, Dict, List, Tuple

from authentication.models import UserModel
from communities.groups.factories import (
    GroupFactory,
    GroupFaqFactory,
    GroupResourceFactory,
    GroupSocialLinkFactory,
    GroupTextFactory,
)
from communities.groups.models import Group
from communities.organizations.models import Organization
from content.models import Topic


def create_org_groups(
    *,
    user: UserModel,
    user_topic: Topic,
    user_topic_name: str,
    user_org: Organization,
    assigned_groups: List[Dict[str, Any]],
    num_groups_per_org: int,
    num_faq_entries_per_entity: int,
    num_resources_per_entity: int,
) -> Tuple[List[Group], int, int, int]:
    """
    Create groups for `user_org`.

    Parameters
    ----------
    user : UserModel
        The user for which entities are being generated for.

    user_topic : Topic
        The topic of the user.

    user_topic_name : str
        The name of the user's topic.

    user_org : Organization
        The organization for which events are being generated for.

    assigned_groups : List[Dict[str, Any]]
        The per-org 'groups' list from the org spec (may be []).

        - If not empty, this function will consume (pop) the first item and use values from it where provided.
        - If empty, deterministic fallback names are used.

    num_groups_per_org : int
        The number of groups that should be assigned to each organization from populate_db.

    num_faq_entries_per_entity : int
        The number of FAQ entries that should be assigned to each entity from populate_db.

    num_resources_per_entity : int
        The number of resources that should be assigned to each entity from populate_db.

    Returns
    -------
    Tuple[List[Group], int, int, int]
        A list of groups created along with the number of social links, resources and faq entries created for them.
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
            else f"{user_org.name}:g{g}"
        )
        tagline = (
            spec.get("tagline")
            if spec and "tagline" in spec
            else f"Fighting for {user_topic_name.lower()}"
        )

        user_org_group = GroupFactory(
            created_by=user,
            name=group_id,
            org=user_org,
            tagline=tagline,
        )

        # MARK: Texts

        texts_spec = spec.get("texts", {}) if spec else {}
        group_texts = GroupTextFactory(iso="en", primary=True, **texts_spec)
        user_org_group.texts.set([group_texts])

        # MARK: Social Links

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

        # MARK: FAQs

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

        # MARK: Resources

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

                with contextlib.suppress(Exception):
                    res.topics.set([user_topic])

                n_resources += 1

        groups.append(user_org_group)

    return groups, n_social, n_resources, n_faq
