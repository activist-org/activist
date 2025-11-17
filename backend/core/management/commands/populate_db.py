# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Classes controlling the CLI command to populate the database when starting the backend.
"""

# mypy: ignore-errors
import json
import random
from argparse import ArgumentParser
from typing import Any, TypedDict

from django.core.management.base import BaseCommand
from typing_extensions import Unpack

from authentication.factories import UserFactory
from authentication.models import UserModel
from communities.groups.models import Group
from communities.organizations.models import Organization
from content.models import Topic
from events.models import Event

from .populate_db_helpers.populate_org_events import create_org_events
from .populate_db_helpers.populate_org_group_event import create_group_events
from .populate_db_helpers.populate_org_groups import create_org_groups
from .populate_db_helpers.populate_orgs import create_organization

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
        num_events_per_group = options["events_per_group"]
        num_resources_per_entity = options["resources_per_entity"]
        num_faq_entries_per_entity = options["faq_entries_per_entity"]

        # MARK: Load Data

        assigned_org_fields = []
        if options["json_data_to_assign"]:
            with open(options["json_data_to_assign"], encoding="utf-8") as f:
                json_data_to_assign = json.loads(f.read())

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

        n_social_links = 0
        n_faq_entries = 0
        n_resources = 0

        # MARK: Populate Data

        try:
            users = [
                UserFactory(username=f"activist_{i}", name=f"Activist {i}")
                for i in range(num_users)
            ]

            # Confirm activist_0 for testing purposes.
            if users:
                users[0].is_confirmed = True
                users[0].set_password("password")  # ensure password is set
                users[0].save()

            for u, user in enumerate(users):
                user_topic = random.choice(topics)
                user.topics.set([user_topic])
                user_topic_name = get_topic_label(topic=user_topic)

                for o in range(num_orgs_per_user):
                    # MARK: Org
                    user_org, s_links, resources, faqs, assigned_org_spec = (
                        create_organization(
                            user=user,
                            user_topic=user_topic,
                            assigned_org_fields=assigned_org_fields,  # pass the list (may be empty)
                            num_faq_entries_per_entity=num_faq_entries_per_entity,
                            num_resources_per_entity=num_resources_per_entity,
                        )
                    )

                    n_social_links += s_links
                    n_faq_entries += faqs
                    n_resources += resources

                    # MARK: Org Events
                    assigned_events = (
                        assigned_org_spec.get("events", []) if assigned_org_spec else []
                    )
                    s, r, f = create_org_events(
                        user=user,
                        user_topic=user_topic,
                        user_topic_name=user_topic_name,
                        user_org=user_org,
                        assigned_events=assigned_events,
                        num_events_per_org=num_events_per_org,
                        num_faq_entries_per_entity=num_faq_entries_per_entity,
                        num_resources_per_entity=num_resources_per_entity,
                    )

                    n_social_links += s
                    n_resources += r
                    n_faq_entries += f

                    # MARK: Org Groups
                    assigned_groups = (
                        assigned_org_spec.get("groups", []) if assigned_org_spec else []
                    )
                    groups, gs, gr, gf = create_org_groups(
                        user=user,
                        user_topic=user_topic,
                        user_topic_name=user_topic_name,
                        user_org=user_org,
                        assigned_groups=assigned_groups,
                        num_groups_per_org=num_groups_per_org,
                        num_faq_entries_per_entity=num_faq_entries_per_entity,
                        num_resources_per_entity=num_resources_per_entity,
                    )

                    n_social_links += gs
                    n_resources += gr
                    n_faq_entries += gf

                    # MARK: Org Group Events

                    for g_index, user_org_group in enumerate(groups):
                        group_spec = (
                            assigned_groups[g_index]
                            if g_index < len(assigned_groups)
                            else {}
                        )
                        assigned_group_events = (
                            group_spec.get("events", []) if group_spec else []
                        )
                        s, r, f = create_group_events(
                            user=user,
                            user_topic=user_topic,
                            user_topic_name=user_topic_name,
                            user_org=user_org,
                            group=user_org_group,
                            assigned_group_events=assigned_group_events,
                            num_events_per_group=num_events_per_group,
                            num_faq_entries_per_entity=num_faq_entries_per_entity,
                            num_resources_per_entity=num_resources_per_entity,
                        )

                        n_social_links += s
                        n_resources += r
                        n_faq_entries += f

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
