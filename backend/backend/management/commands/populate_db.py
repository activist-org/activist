from argparse import ArgumentParser
from typing import TypedDict, Unpack

from django.core.management.base import BaseCommand

from authentication.factories import UserFactory


class Options(TypedDict):
    users: int


class Command(BaseCommand):
    help = "Populate the database with dummy data"

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--users", type=int, default=100)

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        number_of_users = options["users"]
        try:
            UserFactory.create_batch(number_of_users)
            self.stdout.write(
                self.style.ERROR(f"Number of users created: {number_of_users}")
            )
        except Exception as error:
            self.stdout.write(
                self.style.ERROR(
                    f"An error occured during the creation of dummy data: {error}"
                )
            )
