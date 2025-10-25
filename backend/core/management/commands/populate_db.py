# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Classes controlling the CLI command to populate the database when starting the backend.
"""

# mypy: ignore-errors
import json
import random
from argparse import ArgumentParser
from typing import Any, List, TypedDict

from django.core.management.base import BaseCommand
from typing_extensions import Unpack

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.groups.factories import (
    GroupFactory,
    GroupFaqFactory,
    GroupResourceFactory,
    GroupSocialLinkFactory,
    GroupTextFactory,
)
from communities.groups.models import Group
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationFaqFactory,
    OrganizationResourceFactory,
    OrganizationSocialLinkFactory,
    OrganizationTextFactory,
)
from communities.organizations.models import Organization
from content.models import Topic
from events.factories import (
    EventFactory,
    EventFaqFactory,
    EventResourceFactory,
    EventSocialLinkFactory,
    EventTextFactory,
)
from events.models import Event

# MARK: Utils and Types


def get_topic_label(topic: Topic) -> str:
    """
    Return the label of a topic from the object.

    Parameters
    ----------
    topic : Topic
        The topic object that the label should be derived for.

    Returns
    -------
    str
        The human readable name of the topic.
    """
    return (
        " ".join([t[0] + t[1:].lower() for t in topic.type.split("_")])
        .replace("Womens", "Women's")
        .replace("Lgbtqia", "LGBTQIA+")
    )


class Options(TypedDict):
    """
    Options available to the populate_db management CLI command.
    """

    users: int
    orgs_per_user: int
    groups_per_org: int
    events_per_org: int
    events_per_group: int
    resources_per_entity: int
    faq_entries_per_entity: int
    json_data_to_assign: dict[str, Any]


class Command(BaseCommand):
    """
    The populate_db CLI command for populating the database when starting the backend.
    """

    help = "Populate the database with dummy data"

    # MARK: Arguments

    def add_arguments(self, parser: ArgumentParser) -> None:
        """
        Add arguments into the parser.

        Parameters
        ----------
        parser : ArgumentParser
            A parser for passing CLI arguments to the command.
        """
        parser.add_argument("--users", type=int, default=10)
        parser.add_argument("--orgs-per-user", type=int, default=1)
        parser.add_argument("--groups-per-org", type=int, default=1)
        parser.add_argument("--events-per-org", type=int, default=1)
        parser.add_argument("--events-per-group", type=int, default=1)
        parser.add_argument("--faq-entries-per-entity", type=int, default=1)
        parser.add_argument("--resources-per-entity", type=int, default=1)
        parser.add_argument("--json-data-to-assign", type=str)

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        """
        Handle arguments passed to the parser.

        Parameters
        ----------
        *args : str
            Optional string arguments.

        **options : Unpack[Options]
            Options that can be used to control the database wait functionality.
        """
        # MARK: Load Arguments

        num_users = options["users"]
        num_orgs_per_user = options["orgs_per_user"]
        num_groups_per_org = options["groups_per_org"]
        num_events_per_org = options["events_per_org"]
        num_events_per_group = options["events_per_org"]
        num_resources_per_entity = options["resources_per_entity"]
        num_faq_entries_per_entity = options["faq_entries_per_entity"]

        # MARK: Load Data

        with open(options["json_data_to_assign"], encoding="utf-8") as f:
            json_data_to_assign = json.loads(f.read())

        assigned_org_fields = []
        if "organizations" in json_data_to_assign:
            assigned_org_fields = json_data_to_assign["organizations"]

        # MARK: Clear Data

        # Clear all tables before creating new data.
        UserModel.objects.exclude(username="admin").delete()
        Organization.objects.all().delete()
        Group.objects.all().delete()
        Event.objects.all().delete()

        topics = Topic.objects.all()

        # MARK: Set Data Totals

        n_orgs = 0
        n_social_links = 0
        n_faq_entries = 0
        n_resources = 0

        # MARK: Populate Data

        try:
            users = [
                UserFactory(username=f"activist_{i}", name=f"Activist {i}")
                for i in range(num_users)
            ]

            for u, user in enumerate(users):
                user_topic = random.choice(topics)
                user.topics.set([user_topic])
                user_topic_name = get_topic_label(topic=user_topic)

                for o in range(num_orgs_per_user):
                    # MARK: Org

                    org_id = (
                        assigned_org_fields[n_orgs]["org_name"]
                        if n_orgs < len(assigned_org_fields)
                        and "org_name" in assigned_org_fields[n_orgs]
                        else f"organization_u{u}_o{o}"
                    )
                    org_name = (
                        assigned_org_fields[n_orgs]["name"]
                        if n_orgs < len(assigned_org_fields)
                        and "name" in assigned_org_fields[n_orgs]
                        else f"{user_topic_name} Organization"
                    )
                    tagline = (
                        assigned_org_fields[n_orgs]["tagline"]
                        if n_orgs < len(assigned_org_fields)
                        and "tagline" in assigned_org_fields[n_orgs]
                        else f"Fighting for {user_topic_name.lower()}"
                    )

                    user_org = OrganizationFactory(
                        created_by=user,
                        org_name=org_id,
                        name=org_name,
                        tagline=tagline,
                    )

                    user_org.topics.set([user_topic])

                    # MARK: Org Texts

                    assigned_org_text_fields = (
                        assigned_org_fields[n_orgs]["texts"]
                        if n_orgs < len(assigned_org_fields)
                        and "texts" in assigned_org_fields[n_orgs]
                        else {}
                    )

                    org_texts = OrganizationTextFactory(
                        iso="en", primary=True, **assigned_org_text_fields
                    )
                    user_org.texts.set([org_texts])

                    # MARK: Org Links

                    org_social_links: List[OrganizationSocialLinkFactory] = []

                    assigned_org_link_fields = []
                    if (
                        n_orgs < len(assigned_org_fields)
                        and "social_links" in assigned_org_fields[n_orgs]
                    ):
                        assigned_org_link_fields = assigned_org_fields[n_orgs][
                            "social_links"
                        ]

                    if assigned_org_link_fields:
                        org_social_links.extend(
                            OrganizationSocialLinkFactory(**assigned_org_link_fields[s])
                            for s in range(len(assigned_org_link_fields))
                        )

                        n_social_links += len(assigned_org_link_fields)

                    else:
                        org_social_links.extend(
                            OrganizationSocialLinkFactory(
                                label=f"Social Link {s}", order=s
                            )
                            for s in range(3)
                        )

                        n_social_links += 3

                    user_org.social_links.set(org_social_links)

                    # MARK: Org FAQs

                    org_faqs: List[OrganizationFaqFactory] = []

                    assigned_org_faq_fields = []
                    if (
                        n_orgs < len(assigned_org_fields)
                        and "faqs" in assigned_org_fields[n_orgs]
                    ):
                        assigned_org_faq_fields = assigned_org_fields[n_orgs]["faqs"]

                    if assigned_org_faq_fields:
                        org_faqs.extend(
                            OrganizationFaqFactory(
                                org=user_org, order=f, **assigned_org_faq_fields[f]
                            )
                            for f in range(len(assigned_org_faq_fields))
                        )

                        n_faq_entries += len(assigned_org_faq_fields)

                    else:
                        org_faqs.extend(
                            OrganizationFaqFactory(org=user_org, order=f)
                            for f in range(num_faq_entries_per_entity)
                        )

                        n_faq_entries += num_faq_entries_per_entity

                    user_org.faqs.set(org_faqs)

                    # MARK: Org Resources

                    assigned_org_resource_fields = []
                    if (
                        n_orgs < len(assigned_org_fields)
                        and "resources" in assigned_org_fields[n_orgs]
                    ):
                        assigned_org_resource_fields = assigned_org_fields[n_orgs][
                            "resources"
                        ]

                    if assigned_org_resource_fields:
                        for r in range(len(assigned_org_resource_fields)):
                            user_org.resources.add(
                                OrganizationResourceFactory(
                                    created_by=user,
                                    org=user_org,
                                    order=r,
                                    **assigned_org_resource_fields[r],
                                )
                            )

                            n_resources += 1

                    else:
                        for r in range(num_resources_per_entity):
                            user_org_resource = OrganizationResourceFactory(
                                created_by=user, org=user_org, order=r
                            )
                            user_org.resources.add(user_org_resource)
                            user_org_resource.topics.set([user_topic])

                            n_resources += 1

                    # MARK: Org Events

                    assigned_org_event_fields = []
                    if (
                        n_orgs < len(assigned_org_fields)
                        and "events" in assigned_org_fields[n_orgs]
                    ):
                        assigned_org_event_fields = assigned_org_fields[n_orgs][
                            "events"
                        ]

                    for eo in range(num_events_per_org):
                        if eo < len(assigned_org_event_fields):
                            event_name = assigned_org_event_fields[eo]["name"]
                            event_tagline = assigned_org_event_fields[eo]["tagline"]
                            event_type = assigned_org_event_fields[eo]["type"]
                            user_org_event = EventFactory(
                                name=event_name,
                                tagline=event_tagline,
                                type=event_type,
                                created_by=user,
                                orgs=user_org,
                            )

                        else:
                            event_type = random.choice(["learn", "action"])
                            event_type_verb = (
                                "Learning about"
                                if event_type == "learn"
                                else "Fighting for"
                            )

                            user_org_event = EventFactory(
                                name=f"{user_topic_name} Event [u{u}:o{o}:e{eo}]",
                                tagline=f"{event_type_verb} {user_topic_name}",
                                type=event_type,
                                created_by=user,
                                orgs=user_org,
                            )

                        user_org_event.topics.set([user_topic])

                        # MARK: Org Event Texts

                        assigned_org_event_text_fields = (
                            assigned_org_event_fields[eo]["texts"]
                            if n_orgs < len(assigned_org_fields)
                            and "events" in assigned_org_fields[n_orgs]
                            and eo < len(assigned_org_event_fields)
                            and "texts" in assigned_org_event_fields[eo]
                            else {}
                        )

                        event_texts = EventTextFactory(
                            iso="en", primary=True, **assigned_org_event_text_fields
                        )
                        user_org_event.texts.set([event_texts])

                        # MARK: Org Event Links

                        org_event_social_links: List[EventSocialLinkFactory] = []

                        assigned_org_event_link_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "events" in assigned_org_fields[n_orgs]
                            and eo < len(assigned_org_event_fields)
                            and "social_links" in assigned_org_event_fields[eo]
                        ):
                            assigned_org_event_link_fields = assigned_org_fields[
                                n_orgs
                            ]["events"][eo]["social_links"]

                        if assigned_org_event_link_fields:
                            org_event_social_links.extend(
                                EventSocialLinkFactory(
                                    **assigned_org_event_link_fields[s]
                                )
                                for s in range(len(assigned_org_event_link_fields))
                            )

                            n_social_links += len(assigned_org_event_link_fields)

                        else:
                            org_event_social_links.extend(
                                EventSocialLinkFactory(
                                    label=f"Social Link {s}", order=s
                                )
                                for s in range(3)
                            )

                            n_social_links += 3

                        user_org_event.social_links.set(org_event_social_links)

                        # MARK: Org Event FAQs

                        user_org_event_faqs: List[EventFaqFactory] = []

                        assigned_org_event_faq_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "events" in assigned_org_fields[n_orgs]
                            and eo < len(assigned_org_event_fields)
                            and "faqs" in assigned_org_event_fields[eo]
                        ):
                            assigned_org_event_faq_fields = assigned_org_fields[n_orgs][
                                "events"
                            ][eo]["faqs"]

                        if assigned_org_event_faq_fields:
                            user_org_event_faqs.extend(
                                EventFaqFactory(
                                    event=user_org_event,
                                    order=f,
                                    **assigned_org_event_faq_fields[f],
                                )
                                for f in range(len(assigned_org_event_faq_fields))
                            )

                            n_faq_entries += len(assigned_org_event_faq_fields)

                        else:
                            user_org_event_faqs.extend(
                                EventFaqFactory(event=user_org_event, order=f)
                                for f in range(num_faq_entries_per_entity)
                            )

                            n_faq_entries += num_faq_entries_per_entity

                        user_org_event.faqs.set(user_org_event_faqs)

                        # MARK: Org Event Resources

                        assigned_org_event_resource_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "events" in assigned_org_fields[n_orgs]
                            and eo < len(assigned_org_event_fields)
                            and "resources" in assigned_org_event_fields[eo]
                        ):
                            assigned_org_event_resource_fields = assigned_org_fields[
                                n_orgs
                            ]["events"][eo]["resources"]

                        if assigned_org_event_resource_fields:
                            for r in range(len(assigned_org_event_resource_fields)):
                                user_org_event.resources.add(
                                    EventResourceFactory(
                                        created_by=user,
                                        event=user_org_event,
                                        order=r,
                                        **assigned_org_event_resource_fields[r],
                                    )
                                )

                                n_resources += 1

                        else:
                            for r in range(num_resources_per_entity):
                                user_org_event_resource = EventResourceFactory(
                                    created_by=user, event=user_org_event, order=r
                                )
                                user_org_event.resources.add(user_org_event_resource)
                                user_org_event_resource.topics.set([user_topic])

                                n_resources += 1

                    # MARK: Org Groups

                    assigned_org_group_fields = []
                    if (
                        n_orgs < len(assigned_org_fields)
                        and "groups" in assigned_org_fields[n_orgs]
                    ):
                        assigned_org_group_fields = assigned_org_fields[n_orgs][
                            "groups"
                        ]

                    for g in range(num_groups_per_org):
                        group_id = (
                            assigned_org_group_fields[g]["group_name"]
                            if g < len(assigned_org_group_fields)
                            and "group_name" in assigned_org_group_fields[g]
                            else f"org_u{u}_o{o}:g{g}"
                        )
                        group_name = (
                            assigned_org_group_fields[g]["name"]
                            if g < len(assigned_org_group_fields)
                            and "name" in assigned_org_group_fields[g]
                            else f"{user_topic_name} Group {g}"
                        )
                        tagline = (
                            assigned_org_group_fields[g]["tagline"]
                            if g < len(assigned_org_group_fields)
                            and "tagline" in assigned_org_group_fields[g]
                            else f"Fighting for {user_topic_name.lower()}"
                        )

                        user_org_group = GroupFactory(
                            created_by=user,
                            group_name=group_id,
                            name=group_name,
                            org=user_org,
                            tagline=tagline,
                        )

                        # MARK: Org Group Texts

                        assigned_org_group_text_fields = (
                            assigned_org_group_fields[g]["texts"]
                            if n_orgs < len(assigned_org_fields)
                            and "groups" in assigned_org_fields[n_orgs]
                            and g < len(assigned_org_group_fields)
                            and "texts" in assigned_org_group_fields[g]
                            else {}
                        )

                        group_texts = GroupTextFactory(
                            iso="en", primary=True, **assigned_org_group_text_fields
                        )
                        user_org_group.texts.set([group_texts])

                        # MARK: Org Group Links

                        org_group_social_links: List[GroupSocialLinkFactory] = []

                        assigned_org_group_link_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "groups" in assigned_org_fields[n_orgs]
                            and g < len(assigned_org_group_fields)
                            and "social_links" in assigned_org_group_fields[g]
                        ):
                            assigned_org_group_link_fields = assigned_org_fields[
                                n_orgs
                            ]["groups"][g]["social_links"]

                        if assigned_org_group_link_fields:
                            org_group_social_links.extend(
                                GroupSocialLinkFactory(
                                    **assigned_org_group_link_fields[s]
                                )
                                for s in range(len(assigned_org_group_link_fields))
                            )

                            n_social_links += len(assigned_org_group_link_fields)

                        else:
                            org_group_social_links.extend(
                                GroupSocialLinkFactory(
                                    label=f"Social Link {s}", order=s
                                )
                                for s in range(3)
                            )

                            n_social_links += 3

                        user_org_group.social_links.set(org_group_social_links)

                        # MARK: Org Group FAQs

                        user_org_group_faqs: List[GroupFaqFactory] = []

                        assigned_org_group_faq_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "groups" in assigned_org_fields[n_orgs]
                            and g < len(assigned_org_group_fields)
                            and "faqs" in assigned_org_group_fields[g]
                        ):
                            assigned_org_group_faq_fields = assigned_org_fields[n_orgs][
                                "groups"
                            ][g]["faqs"]

                        if assigned_org_group_faq_fields:
                            user_org_group_faqs.extend(
                                GroupFaqFactory(
                                    group=user_org_group,
                                    order=f,
                                    **assigned_org_group_faq_fields[f],
                                )
                                for f in range(len(assigned_org_group_faq_fields))
                            )

                            n_faq_entries += len(assigned_org_group_faq_fields)

                        else:
                            user_org_group_faqs.extend(
                                GroupFaqFactory(group=user_org_group, order=f)
                                for f in range(num_faq_entries_per_entity)
                            )

                            n_faq_entries += num_faq_entries_per_entity

                        user_org_group.faqs.set(user_org_group_faqs)

                        # MARK: Org Group Resources

                        assigned_org_group_resource_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "groups" in assigned_org_fields[n_orgs]
                            and g < len(assigned_org_group_fields)
                            and "resources" in assigned_org_group_fields[g]
                        ):
                            assigned_org_group_resource_fields = assigned_org_fields[
                                n_orgs
                            ]["groups"][g]["resources"]

                        if assigned_org_group_resource_fields:
                            for r in range(len(assigned_org_group_resource_fields)):
                                user_org_group.resources.add(
                                    GroupResourceFactory(
                                        created_by=user,
                                        group=user_org_group,
                                        order=r,
                                        **assigned_org_group_resource_fields[r],
                                    )
                                )

                                n_resources += 1

                        else:
                            for r in range(num_resources_per_entity):
                                user_org_group_resource = GroupResourceFactory(
                                    created_by=user, group=user_org_group, order=r
                                )
                                user_org_group.resources.add(user_org_group_resource)
                                user_org_group_resource.topics.set([user_topic])

                                n_resources += 1

                        # MARK: Org Group Events

                        assigned_org_group_event_fields = []
                        if (
                            n_orgs < len(assigned_org_fields)
                            and "groups" in assigned_org_fields[n_orgs]
                            and g < len(assigned_org_fields[n_orgs]["groups"])
                            and "events" in assigned_org_fields[n_orgs]["groups"][g]
                        ):
                            assigned_org_group_event_fields = assigned_org_fields[
                                n_orgs
                            ]["groups"][g]["events"]

                        for eg in range(num_events_per_group):
                            if eg < len(assigned_org_group_event_fields):
                                org_group_event_name = assigned_org_group_event_fields[
                                    eg
                                ]["name"]
                                org_group_event_tagline = (
                                    assigned_org_group_event_fields[eg]["tagline"]
                                )
                                org_group_event_type = assigned_org_group_event_fields[
                                    eg
                                ]["type"]
                                user_org_group_event = EventFactory(
                                    name=org_group_event_name,
                                    tagline=org_group_event_tagline,
                                    type=org_group_event_type,
                                    created_by=user,
                                    orgs=user_org,
                                    group=user_org_group,
                                )

                            else:
                                event_type = random.choice(["learn", "action"])
                                event_type_verb = (
                                    "Learning about"
                                    if event_type == "learn"
                                    else "Fighting for"
                                )

                                user_org_group_event = EventFactory(
                                    name=f"{user_topic_name} Event [u{u}:o{o}:e{eg}]",
                                    tagline=f"{event_type_verb} {user_topic_name}",
                                    type=event_type,
                                    created_by=user,
                                    orgs=user_org,
                                    group=user_org_group,
                                )

                            user_org_group_event.topics.set([user_topic])

                            # MARK: Org Group Event Texts

                            assigned_org_group_event_text_fields = (
                                assigned_org_group_event_fields[eg]["texts"]
                                if n_orgs < len(assigned_org_fields)
                                and "groups" in assigned_org_fields[n_orgs]
                                and g < len(assigned_org_fields[n_orgs]["groups"])
                                and "events" in assigned_org_fields[n_orgs]["groups"][g]
                                and eg < len(assigned_org_group_event_fields)
                                and "texts" in assigned_org_group_event_fields[eg]
                                else {}
                            )

                            event_texts = EventTextFactory(
                                iso="en",
                                primary=True,
                                **assigned_org_group_event_text_fields,
                            )
                            user_org_group_event.texts.set([event_texts])

                            # MARK: Org Group Event Links

                            org_group_event_social_links: List[
                                EventSocialLinkFactory
                            ] = []

                            assigned_org_group_event_link_fields = []
                            if (
                                n_orgs < len(assigned_org_fields)
                                and "events" in assigned_org_fields[n_orgs]
                                and eg < len(assigned_org_group_event_fields)
                                and "social_links"
                                in assigned_org_group_event_fields[eg]
                            ):
                                assigned_org_group_event_link_fields = (
                                    assigned_org_fields[n_orgs]["events"][eg][
                                        "social_links"
                                    ]
                                )

                            if assigned_org_group_event_link_fields:
                                org_group_event_social_links.extend(
                                    EventSocialLinkFactory(
                                        **assigned_org_group_event_link_fields[s]
                                    )
                                    for s in range(
                                        len(assigned_org_group_event_link_fields)
                                    )
                                )

                                n_social_links += len(
                                    assigned_org_group_event_link_fields
                                )

                            else:
                                org_group_event_social_links.extend(
                                    EventSocialLinkFactory(
                                        label=f"Social Link {s}", order=s
                                    )
                                    for s in range(3)
                                )

                                n_social_links += 3

                            user_org_group_event.social_links.set(
                                org_group_event_social_links
                            )

                            # MARK: Org Group Event FAQs

                            user_org_group_event_faqs: List[EventFaqFactory] = []

                            assigned_org_event_faq_fields = []
                            if (
                                n_orgs < len(assigned_org_fields)
                                and "events" in assigned_org_fields[n_orgs]
                                and eg < len(assigned_org_group_event_fields)
                                and "faqs" in assigned_org_group_event_fields[eg]
                            ):
                                assigned_org_event_faq_fields = assigned_org_fields[
                                    n_orgs
                                ]["events"][eg]["faqs"]

                            if assigned_org_event_faq_fields:
                                user_org_group_event_faqs.extend(
                                    EventFaqFactory(
                                        event=user_org_group_event,
                                        order=f,
                                        **assigned_org_event_faq_fields[f],
                                    )
                                    for f in range(len(assigned_org_event_faq_fields))
                                )

                                n_faq_entries += len(assigned_org_event_faq_fields)

                            else:
                                user_org_group_event_faqs.extend(
                                    EventFaqFactory(event=user_org_group_event, order=f)
                                    for f in range(num_faq_entries_per_entity)
                                )

                                n_faq_entries += num_faq_entries_per_entity

                            user_org_group_event.faqs.set(user_org_group_event_faqs)

                            # MARK: Org Group Event Resources

                            assigned_org_group_event_resource_fields = []
                            if (
                                n_orgs < len(assigned_org_fields)
                                and "events" in assigned_org_fields[n_orgs]
                                and eg < len(assigned_org_group_event_fields)
                                and "resources" in assigned_org_group_event_fields[eg]
                            ):
                                assigned_org_group_event_resource_fields = (
                                    assigned_org_fields[n_orgs]["events"][eg][
                                        "resources"
                                    ]
                                )

                            if assigned_org_group_event_resource_fields:
                                for r in range(
                                    len(assigned_org_group_event_resource_fields)
                                ):
                                    user_org_group_event.resources.add(
                                        EventResourceFactory(
                                            created_by=user,
                                            event=user_org_group_event,
                                            order=r,
                                            **assigned_org_group_event_resource_fields[
                                                r
                                            ],
                                        )
                                    )

                                    n_resources += 1

                            else:
                                for r in range(num_resources_per_entity):
                                    user_org_group_event_resource = (
                                        EventResourceFactory(
                                            created_by=user,
                                            event=user_org_group_event,
                                            order=r,
                                        )
                                    )
                                    user_org_group_event.resources.add(
                                        user_org_group_event_resource
                                    )
                                    user_org_group_event_resource.topics.set(
                                        [user_topic]
                                    )

                                    n_resources += 1

                    n_orgs += 1

            # MARK: Print Output

            n_orgs_created = num_users * num_orgs_per_user
            n_groups_created = num_users * num_orgs_per_user * num_groups_per_org
            n_events_created = num_users * (
                (num_orgs_per_user * num_events_per_org)
                + (num_orgs_per_user * num_groups_per_org * num_events_per_group)
            )

            self.stdout.write(
                self.style.ERROR(
                    f"Number of users created: {num_users}\n"
                    f"Number of organizations created: {n_orgs_created}\n"
                    f"Number of groups created: {n_groups_created}\n"
                    f"Number of events created: {n_events_created}\n"
                    f"Number of social links created: {n_social_links}\n"
                    f"Number of resources created: {n_resources}\n"
                    f"Number of FAQ entries created: {n_faq_entries}\n"
                )
            )

        except TypeError as error:
            self.stdout.write(
                self.style.ERROR(
                    "A type error occurred during the creation of dummy data:\n"
                    f"{error}"
                    "\nMake sure to use dashes for populate_db arguments and that they're of the appropriate types."
                )
            )
