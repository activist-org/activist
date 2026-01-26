# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Populate the database with events for organizations.
"""

# mypy: ignore-errors
import random
from typing import Any, Dict, List, Tuple

from authentication.models import UserModel
from communities.organizations.models import Organization
from content.models import Topic
from events.factories import (
    EventFactory,
    EventFaqFactory,
    EventResourceFactory,
    EventSocialLinkFactory,
    EventTextFactory,
)


def _resolve_event_setting(event_spec: Dict[str, Any] | None) -> str:
    """Return an appropriate event setting based on provided spec."""
    if event_spec:
        setting = event_spec.get("setting")
        if setting in {"online", "physical"}:
            return setting
        if event_spec.get("online_location_link"):
            return "online"
        if event_spec.get("physical_location"):
            return "physical"
    return random.choice(["online", "physical"])


def create_org_events(
    *,
    user: UserModel,
    user_topic: Topic,
    user_topic_name: str,
    user_org: Organization,
    assigned_events: List[Dict[str, Any]],
    num_events_per_org: int,
    num_faq_entries_per_entity: int,
    num_resources_per_entity: int,
) -> Tuple[int, int, int]:
    """
    Create organization-level events for `user_org`.

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

    assigned_events : List[Dict[str, Any]]
        The data to assign to the generated events.

    num_events_per_org : int
        The number of events that should be assigned to each organization from populate_db.

    num_faq_entries_per_entity : int
        The number of FAQ entries that should be assigned to each entity from populate_db.

    num_resources_per_entity : int
        The number of resources that should be assigned to each entity from populate_db.

    Returns
    -------
    Tuple[int, int, int]
        The number of social links, resources and faq entries created for organization events.
    """
    n_social = 0
    n_resources = 0
    n_faq = 0

    for eo in range(num_events_per_org):
        spec = (
            assigned_events[eo]
            if (assigned_events and eo < len(assigned_events))
            else None
        )

        event_setting = _resolve_event_setting(spec)

        if spec:
            factory_kwargs = {
                "name": spec["name"],
                "tagline": spec["tagline"],
                "type": spec["type"],
                "created_by": user,
                "orgs": user_org,
                "groups": None,
                "setting": event_setting,
            }

            if event_setting == "online":
                factory_kwargs["physical_location"] = None
                if spec.get("online_location_link"):
                    factory_kwargs["online_location_link"] = spec["online_location_link"]
            else:
                factory_kwargs["online_location_link"] = None
                if spec.get("physical_location"):
                    factory_kwargs["physical_location"] = spec["physical_location"]

            user_org_event = EventFactory(**factory_kwargs)

        else:
            event_type = random.choice(["learn", "action"])
            verb = "Learning about" if event_type == "learn" else "Fighting for"
            factory_kwargs = {
                "name": f"{user_topic_name} Event",
                "tagline": f"{verb} {user_topic_name}",
                "type": event_type,
                "created_by": user,
                "orgs": user_org,
                "groups": None,
                "setting": event_setting,
            }

            if event_setting == "online":
                factory_kwargs["physical_location"] = None
            else:
                factory_kwargs["online_location_link"] = None

            user_org_event = EventFactory(**factory_kwargs)

        # MARK: Topics

        user_org_event.topics.set([user_topic])

        # MARK: Texts

        texts = spec.get("texts", {}) if spec else {}
        event_texts = EventTextFactory(iso="en", primary=True, **texts)
        user_org_event.texts.set([event_texts])

        # MARK: Social Links

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

        user_org_event.social_links.set(links)

        # MARK: FAQs

        faqs_spec = spec.get("faqs", []) if spec else []
        if faqs_spec:
            faqs = [
                EventFaqFactory(event=user_org_event, order=i, **faqs_spec[i])
                for i in range(len(faqs_spec))
            ]
            n_faq += len(faqs_spec)

        else:
            faqs = [
                EventFaqFactory(event=user_org_event, order=i)
                for i in range(num_faq_entries_per_entity)
            ]
            n_faq += num_faq_entries_per_entity

        user_org_event.faqs.set(faqs)

        # MARK: Resources

        res_spec = spec.get("resources", []) if spec else []
        if res_spec:
            for i in range(len(res_spec)):
                user_org_event.resources.add(
                    EventResourceFactory(
                        created_by=user, event=user_org_event, order=i, **res_spec[i]
                    )
                )
                n_resources += 1

        else:
            for i in range(num_resources_per_entity):
                res = EventResourceFactory(
                    created_by=user, event=user_org_event, order=i
                )
                user_org_event.resources.add(res)
                res.topics.set([user_topic])
                n_resources += 1

    return n_social, n_resources, n_faq
