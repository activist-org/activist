from argparse import ArgumentParser
from typing import TypedDict, Unpack

from django.core.management.base import BaseCommand

from authentication.factories import UserFactory
from authentication.models import UserModel
from entities.factories import (
    GroupFactory,
    GroupTextFactory,
    OrganizationFactory,
    OrganizationTextFactory,
)
from entities.models import Group, Organization
from events.factories import EventFactory, EventTextFactory
from events.models import Event


class Options(TypedDict):
    users: int
    orgs: int
    groups: int
    events: int


class Command(BaseCommand):
    help = "Populate the database with dummy data"

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--users", type=int, default=10)
        parser.add_argument("--opu", type=int, default=1)  # orgs per user
        parser.add_argument("--gpo", type=int, default=1)  # groups per org
        parser.add_argument("--epo", type=int, default=1)  # events per org

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        n_users = options.get("users")
        n_orgs_per_user = options.get("opu")
        n_groups_per_org = options.get("gpo")
        n_events_per_org = options.get("epo")

        # Clear all tables before creating new data.
        UserModel.objects.exclude(username="admin").delete()
        Organization.objects.all().delete()
        Group.objects.all().delete()
        Event.objects.all().delete()

        try:
            users = [
                UserFactory(username=f"activist_{i}", name=f"Activist {i}")
                for i in range(n_users)
            ]

            for i, user in enumerate(users):
                user_location = "Berlin"
                user_topic = "Climate"

                for _ in range(n_orgs_per_user):
                    user_org = OrganizationFactory(
                        name=f"{user_location} {user_topic} Organization {i}",
                        created_by=user,
                    )

                    OrganizationTextFactory(
                        org_id=user_org,
                        iso="en",
                        primary=True,
                        description="This is an org",
                        get_involved="Get involved!",
                        donate_prompt="Donate!",
                    )

                    for g in range(n_groups_per_org):
                        user_org_group = GroupFactory(
                            org_id=user_org,
                            name=f"{user_location} {user_topic} Group {i}-{g}",
                            created_by=user,
                        )

                        GroupTextFactory(
                            group_id=user_org_group,
                            iso="en",
                            primary=True,
                            description="This is a group",
                            get_involved="Get involved!",
                            donate_prompt="Donate!",
                        )

                    for e in range(n_events_per_org):
                        user_org_event = EventFactory(
                            name=f"{user_location} {user_topic} Event {i}-{e}",
                            created_by=user,
                        )

                        EventTextFactory(
                            event_id=user_org_event,
                            iso="en",
                            primary=True,
                            description="This is a group",
                            get_involved="Get involved!",
                        )

            self.stdout.write(
                self.style.ERROR(
                    f"Number of users created: {n_users}\n"
                    f"Number of organizations created: {n_users * n_orgs_per_user}\n"
                    f"Number of groups created: {n_users * n_orgs_per_user * n_groups_per_org}\n"
                    f"Number of events created: {n_users * n_orgs_per_user * n_events_per_org}\n"
                )
            )

        except Exception as error:
            self.stdout.write(
                self.style.ERROR(
                    f"An error occurred during the creation of dummy data: {error}"
                )
            )
