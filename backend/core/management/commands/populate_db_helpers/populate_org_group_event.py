# SPDX-License-Identifier: AGPL-3.0-or-later

# mypy: ignore-errors

import random
from typing import Any, Dict, List, Tuple

from events.factories import (
    EventFactory,
    EventFaqFactory,
    EventResourceFactory,
    EventSocialLinkFactory,
    EventTextFactory,
)


def create_group_events(
    *,
    user,
    user_topic,
    user_topic_name: str,
    user_org,
    group,
    assigned_group_events: List[Dict[str, Any]],
    num_events_per_group: int,
    num_faq_entries_per_entity: int,
    num_resources_per_entity: int,
) -> Tuple[int, int, int]:
    """
    Create events for `group` (belonging to `user_org`).

    Returns tuple: (n_social_links_created, n_resources_created, n_faq_entries_created)
    """
    n_social = 0
    n_resources = 0
    n_faq = 0

    for eg in range(num_events_per_group):
        spec = (
            assigned_group_events[eg]
            if (assigned_group_events and eg < len(assigned_group_events))
            else None
        )

        if spec:
            user_org_group_event = EventFactory(
                name=spec["name"],
                tagline=spec["tagline"],
                type=spec["type"],
                created_by=user,
                orgs=user_org,
                groups=group,
            )
        else:
            event_type = random.choice(["learn", "action"])
            event_type_verb = (
                "Learning about" if event_type == "learn" else "Fighting for"
            )
            user_org_group_event = EventFactory(
                name=f"{user_topic_name} Event",
                tagline=f"{event_type_verb} {user_topic_name}",
                type=event_type,
                created_by=user,
                orgs=user_org,
                groups=group,
            )

        # topics
        user_org_group_event.topics.set([user_topic])

        # texts
        texts = spec.get("texts", {}) if spec else {}
        event_texts = EventTextFactory(iso="en", primary=True, **texts)
        user_org_group_event.texts.set([event_texts])

        # social links
        links_spec = spec.get("social_links", []) if spec else []
        if links_spec:
            links = [EventSocialLinkFactory(**link) for link in links_spec]
            n_social += len(links_spec)
        else:
            links = [
                EventSocialLinkFactory(label=f"Social Link {s}", order=s)
                for s in range(3)
            ]
            n_social += 3
        user_org_group_event.social_links.set(links)

        # FAQs
        faqs_spec = spec.get("faqs", []) if spec else []
        if faqs_spec:
            faqs = [
                EventFaqFactory(event=user_org_group_event, order=i, **faqs_spec[i])
                for i in range(len(faqs_spec))
            ]
            n_faq += len(faqs_spec)
        else:
            faqs = [
                EventFaqFactory(event=user_org_group_event, order=i)
                for i in range(num_faq_entries_per_entity)
            ]
            n_faq += num_faq_entries_per_entity
        user_org_group_event.faqs.set(faqs)

        # Resources
        resources_spec = spec.get("resources", []) if spec else []
        if resources_spec:
            for i in range(len(resources_spec)):
                user_org_group_event.resources.add(
                    EventResourceFactory(
                        created_by=user,
                        event=user_org_group_event,
                        order=i,
                        **resources_spec[i],
                    )
                )
                n_resources += 1
        else:
            for i in range(num_resources_per_entity):
                res = EventResourceFactory(
                    created_by=user, event=user_org_group_event, order=i
                )
                user_org_group_event.resources.add(res)
                try:
                    res.topics.set([user_topic])
                except Exception:
                    pass
                n_resources += 1

    return n_social, n_resources, n_faq
