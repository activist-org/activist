from argparse import ArgumentParser
from typing import TypedDict, Unpack

from django.core.management.base import BaseCommand

from authentication.factories import UserFactory
from authentication.models import UserModel
from entities.factories import GroupFactory, OrganizationFactory
from entities.models import Group, Organization
from events.factories import EventFactory
from events.models import Event


class Options(TypedDict):
    users: int
    orgs: int
    events: int
    groups: int


class Command(BaseCommand):
    help = "Populate the database with dummy data"

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--users", type=int, default=100)
        parser.add_argument("--orgs", type=int, default=100)
        parser.add_argument("--events", type=int, default=100)
        parser.add_argument("--groups", type=int, default=100)

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        number_of_users = options["users"]
        number_of_orgs = options["orgs"]
        number_of_events = options["events"]
        number_of_groups = options["groups"]

        # Clear all tables before creating new data.
        UserModel.objects.exclude(username="admin").delete()
        Organization.objects.all().delete()
        Event.objects.all().delete()
        Group.objects.all().delete()

        try:
            UserFactory.create_batch(number_of_users)
            OrganizationFactory.create_batch(number_of_orgs)
            EventFactory.create_batch(number_of_events)
            GroupFactory.create_batch(number_of_groups)
            self.stdout.write(
                self.style.ERROR(
                    f"Number of users created: {number_of_users}\n"
                    f"Number of orgs created: {number_of_orgs}\n"
                    f"Number of events created: {number_of_events}\n"
                    f"Number of groups created: {number_of_groups}\n"
                )
            )
        except Exception as error:
            self.stdout.write(
                self.style.ERROR(
                    f"An error occurred during the creation of dummy data: {error}"
                )
            )
