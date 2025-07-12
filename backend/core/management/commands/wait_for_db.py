# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Classes controlling the CLI command to wait for the database before starting the backend.
"""

import sys
import time
from argparse import ArgumentParser
from typing import TypedDict

from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError
from typing_extensions import Unpack


class Options(TypedDict):
    """
    Options available to the wait_for_db management CLI command.
    """

    poll_seconds: float
    max_retries: int


class Command(BaseCommand):
    """
    The wait_for_db CLI command for waiting for the database before starting the backend.
    """

    help = "Wait until the database is available"

    def add_arguments(self, parser: ArgumentParser) -> None:
        """
        Add arguments into the parser.

        Parameters
        ----------
        parser : ArgumentParser
            A parser for passing CLI arguments to the command.
        """
        parser.add_argument("--poll_seconds", type=float, default=2)
        parser.add_argument("--max_retries", type=int, default=30)

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
