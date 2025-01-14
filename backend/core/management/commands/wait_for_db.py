# SPDX-License-Identifier: AGPL-3.0-or-later
import sys
import time
from argparse import ArgumentParser
from typing import TypedDict, Unpack

from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError


class Options(TypedDict):
    poll_seconds: float
    max_retries: int


class Command(BaseCommand):
    help = "Wait until the database is available"

    def add_arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--poll_seconds", type=float, default=2)
        parser.add_argument("--max_retries", type=int, default=30)

    def handle(self, *args: str, **options: Unpack[Options]) -> None:
        poll_seconds = options["poll_seconds"]
        max_retries = options["max_retries"]

        for retry in range(max_retries):
            try:
                connection.ensure_connection()
            except OperationalError as error:
                self.stdout.write(
                    f"Database unavailable on attempt {retry + 1}/{max_retries}: {error}"
                )
                time.sleep(poll_seconds)
            else:
                break
        else:
            self.stdout.write(self.style.ERROR("Database unavailable"))
            sys.exit(1)
