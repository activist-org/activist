# SPDX-License-Identifier: AGPL-3.0-or-later

# mypy: ignore-errors
from typing import Any, Dict, List, Tuple

from authentication.models import UserModel
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
    OrganizationResourceFactory,
    OrganizationSocialLinkFactory,
    OrganizationTextFactory,
)
from communities.organizations.models import Organization
from content.models import Topic


def _get_topic_label(topic: Topic) -> str:
    t = getattr(topic, "type", str(topic))
    return (
        " ".join([p[0] + p[1:].lower() for p in t.split("_")])
        .replace("Womens", "Women's")
        .replace("Lgbtqia", "LGBTQIA+")
    )


def create_organization(
    user: UserModel,
    user_topic: Topic,
    assigned_org_fields: List[Dict[str, Any]],
    num_faq_entries_per_entity: int,
    num_resources_per_entity: int,
) -> Tuple[Organization, int, int, int, Dict[str, Any]]:
    """
    Create one organization for `user`.

    - If `assigned_org_fields` has items, this function will consume (pop) the first
      item and use values from it where provided.
    - If `assigned_org_fields` is empty, deterministic fallback names are used.
    - Returns (user_org, n_social_links_created, n_resources_created, n_faq_entries_created, assigned_fields_used)
    """
    # consume assigned fields if present (caller can pass the global list)
    assigned = assigned_org_fields.pop(0) if assigned_org_fields else {}

    # determine per-user org index (used for stable fallback naming)
    per_user_org_index = Organization.objects.filter(created_by=user).count()

    user_topic_name = _get_topic_label(user_topic)

    # basic fields with fallbacks
    org_id = (
        assigned.get("org_name")
        or f"organization_{user.username}_o{per_user_org_index}"
    )
    org_name = assigned.get("name") or f"{user_topic_name} Organization"
    tagline = assigned.get("tagline") or f"Fighting for {user_topic_name.lower()}"

    user_org = OrganizationFactory(
        created_by=user,
        org_name=org_id,
        name=org_name,
        tagline=tagline,
    )
    user_org.topics.set([user_topic])

    # texts
    assigned_texts = assigned.get("texts", {})
    org_texts = OrganizationTextFactory(iso="en", primary=True, **assigned_texts)
    user_org.texts.set([org_texts])

    # social links
    n_social_links = 0
    assigned_links = assigned.get("social_links", [])
    if assigned_links:
        social_objs = [
            OrganizationSocialLinkFactory(**assigned_links[i])
            for i in range(len(assigned_links))
        ]
        n_social_links += len(assigned_links)
    else:
        social_objs = [
            OrganizationSocialLinkFactory(label=f"Social Link {s}", order=s)
            for s in range(3)
        ]
        n_social_links += 3
    user_org.social_links.set(social_objs)

    # faqs
    n_faq_entries = 0
    assigned_faqs = assigned.get("faqs", [])
    if assigned_faqs:
        faq_objs = [
            OrganizationFaqFactory(org=user_org, order=i, **assigned_faqs[i])
            for i in range(len(assigned_faqs))
        ]
        n_faq_entries += len(assigned_faqs)
    else:
        faq_objs = [
            OrganizationFaqFactory(org=user_org, order=i)
            for i in range(num_faq_entries_per_entity)
        ]
        n_faq_entries += num_faq_entries_per_entity
    user_org.faqs.set(faq_objs)

    # resources
    n_resources = 0
    assigned_resources = assigned.get("resources", [])
    if assigned_resources:
        for i in range(len(assigned_resources)):
            user_org.resources.add(
                OrganizationResourceFactory(
                    created_by=user,
                    org=user_org,
                    order=i,
                    **assigned_resources[i],
                )
            )
            n_resources += 1
    else:
        for i in range(num_resources_per_entity):
            res = OrganizationResourceFactory(created_by=user, org=user_org, order=i)
            user_org.resources.add(res)
            try:
                res.topics.set([user_topic])
            except Exception:
                pass
            n_resources += 1

    return user_org, n_social_links, n_resources, n_faq_entries, assigned
