# SPDX-License-Identifier: AGPL-3.0-or-later
import random
from argparse import ArgumentParser
from typing import List, TypedDict, Unpack

from django.core.management.base import BaseCommand

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.groups.factories import (
    GroupFactory,
    GroupSocialLinkFactory,
    GroupTextFactory,
)
from communities.groups.models import Group
from communities.organizations.factories import (
    OrganizationFactory,
    OrganizationSocialLinkFactory,
    OrganizationTextFactory,
)
from communities.organizations.models import Organization
from content.models import Topic
from events.factories import EventFactory, EventSocialLinkFactory, EventTextFactory
from events.models import Event


class Options(TypedDict):
    users: int
    orgs_per_user: int
    groups_per_org: int
    events_per_org: int
    resources_per_entity: int
    faq_entries_per_entity: int


class Command(BaseCommand):
    help = "Populate the database with dummy data"

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--users", type=int, default=10)
        parser.add_argument("--orgs-per-user", type=int, default=1)
        parser.add_argument("--groups-per-org", type=int, default=1)
        parser.add_argument("--events-per-org", type=int, default=1)
        parser.add_argument("--resources-per-entity", type=int, default=1)
        parser.add_argument("--faq-entries-per-entity", type=int, default=1)

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        num_users = options["users"]
        num_orgs_per_user = options["orgs_per_user"]
        num_groups_per_org = options["groups_per_org"]
        num_events_per_org = options["events_per_org"]
        num_resources_per_entity = options["resources_per_entity"]
        num_faq_entries_per_entity = options["faq_entries_per_entity"]

        # Clear all tables before creating new data.
        UserModel.objects.exclude(username="admin").delete()
        Organization.objects.all().delete()
        Group.objects.all().delete()
        Event.objects.all().delete()

        topics = Topic.objects.all()

        try:
            users = [
                UserFactory(username=f"activist_{i}", name=f"Activist {i}")
                for i in range(num_users)
            ]

            for u, user in enumerate(users):
                user_topic = random.choice(topics)
                user.topics.set([user_topic])

                for o in range(num_orgs_per_user):
                    user_org = OrganizationFactory(
                        created_by=user,
                        org_name=f"organization_u{u}_o{o}",
                        name=f"{user_topic.name} Organization",
                        tagline=f"Fighting for {user_topic.name.lower()}",
                    )

                    org_texts = OrganizationTextFactory(iso="en", primary=True)
                    org_social_links: List[OrganizationSocialLinkFactory] = []
                    org_social_links.extend(
                        OrganizationSocialLinkFactory(label=f"social link {i}", order=i)
                        for i in range(3)
                    )

                    user_org.texts.set([org_texts])
                    user_org.social_links.set(org_social_links)

                    for e in range(num_events_per_org):
                        event_type = random.choice(["learn", "action"])
                        event_type_verb = (
                            "Learning about"
                            if event_type == "learn"
                            else "Fighting for"
                        )

                        user_org_event = EventFactory(
                            name=f"{user_topic.name} Event [o{o}:e{e}]",
                            tagline=f"{event_type_verb} {user_topic.name}",
                            type=event_type,
                            created_by=user,
                            orgs=user_org,
                        )

                        event_texts = EventTextFactory(iso="en", primary=True)
                        event_social_links: List[EventSocialLinkFactory] = []
                        event_social_links.extend(
                            EventSocialLinkFactory(label=f"social link {i}", order=i)
                            for i in range(3)
                        )

                        user_org_event.texts.set([event_texts])
                        user_org_event.social_links.set(event_social_links)

                    for g in range(num_groups_per_org):
                        user_org_group = GroupFactory(
                            created_by=user,
                            group_name=f"group_u{u}_o{o}_g{g}",
                            name=f"{user_topic.name} Group",
                            org=user_org,
                            tagline=f"Fighting for {user_topic.name.lower()}",
                        )

                        group_texts = GroupTextFactory(iso="en", primary=True)
                        group_social_links: List[GroupSocialLinkFactory] = []
                        group_social_links.extend(
                            GroupSocialLinkFactory(label=f"social link {i}", order=i)
                            for i in range(3)
                        )

                        user_org_group.texts.set([group_texts])
                        user_org_group.social_links.set(group_social_links)

            num_orgs = num_users * num_orgs_per_user
            num_groups = num_users * num_orgs_per_user * num_groups_per_org
            num_events = num_users * num_orgs_per_user * num_events_per_org
            num_resources = num_users * (
                num_orgs_per_user
                + num_orgs_per_user * num_events_per_org * num_resources_per_entity
                + num_orgs_per_user * num_groups_per_org * num_resources_per_entity
            )
            num_faq_entries = num_users * (
                num_orgs_per_user
                + num_orgs_per_user * num_events_per_org * num_faq_entries_per_entity
                + num_orgs_per_user * num_groups_per_org * num_faq_entries_per_entity
            )

            self.stdout.write(
                self.style.ERROR(
                    f"Number of users created: {num_users}\n"
                    f"Number of organizations created: {num_orgs}\n"
                    f"Number of groups created: {num_groups}\n"
                    f"Number of events created: {num_events}\n"
                    f"Number of resources created: {num_resources}\n"
                    f"Number of FAQ entries created: {num_faq_entries}\n"
                )
            )

        except TypeError as error:
            self.stdout.write(
                self.style.ERROR(
                    f"A type error occurred during the creation of dummy data: {error}. Make sure to use dashes for populate_db arguments and that they're of the appropriate types."
                )
            )
