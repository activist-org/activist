# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Management command to populate the database with data from a JSON file.

This command allows importing organizations, events, groups, and resources
from a properly formatted JSON file. The data is validated against a schema
before being imported into the database.
"""

import json
import os
from argparse import ArgumentParser
from typing import Any, Dict, List

from django.core.management.base import BaseCommand, CommandError
from jsonschema import ValidationError, validate

# MARK: - Schema Definition
# This schema ensures the data follows the expected format before processing.

SCHEMA = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "organizations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "name": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "description": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "website": {"type": "string", "format": "uri"},
                    "email": {"type": "string", "format": "email"},
                    "phone": {"type": "string"},
                    "social_links": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "platform": {"type": "string"},
                                "url": {"type": "string", "format": "uri"},
                            },
                            "required": ["platform", "url"],
                        },
                    },
                    "resources": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "title": {
                                    "type": "object",
                                    "additionalProperties": {"type": "string"},
                                },
                                "description": {
                                    "type": "object",
                                    "additionalProperties": {"type": "string"},
                                },
                                "url": {"type": "string", "format": "uri"},
                                "type": {"type": "string"},
                            },
                            "required": ["title", "url"],
                        },
                    },
                },
                "required": ["id", "name", "description"],
            },
        },
        "events": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "organization_id": {"type": "string"},
                    "title": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "description": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "start_time": {"type": "string", "format": "date-time"},
                    "end_time": {"type": "string", "format": "date-time"},
                    "location": {"type": "string"},
                    "is_online": {"type": "boolean"},
                    "registration_url": {"type": "string", "format": "uri"},
                    "topics": {"type": "array", "items": {"type": "string"}},
                    "social_links": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "platform": {"type": "string"},
                                "url": {"type": "string", "format": "uri"},
                            },
                            "required": ["platform", "url"],
                        },
                    },
                },
                "required": ["id", "organization_id", "title", "start_time"],
            },
        },
        "groups": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "organization_id": {"type": "string"},
                    "name": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "description": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "is_private": {"type": "boolean"},
                    "topics": {"type": "array", "items": {"type": "string"}},
                    "social_links": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "platform": {"type": "string"},
                                "url": {"type": "string", "format": "uri"},
                            },
                            "required": ["platform", "url"],
                        },
                    },
                },
                "required": ["id", "organization_id", "name"],
            },
        },
        "resources": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "title": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "description": {
                        "type": "object",
                        "additionalProperties": {"type": "string"},
                    },
                    "url": {"type": "string", "format": "uri"},
                    "type": {"type": "string"},
                    "topics": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["id", "title", "url"],
            },
        },
    },
}


class Command(BaseCommand):
    """
    Management command to populate the database with data from a JSON file.

    This command imports data from a JSON file that follows the specified schema,
    allowing for bulk import of organizations, events, groups, and resources.
    The data is validated against the schema before being processed.
    """

    help = "Populates the database with data from a JSON file"

    def add_arguments(self, parser: ArgumentParser) -> None:
        """
        Define the command-line arguments for this management command.

        Parameters
        ----------
        parser : argparse.ArgumentParser
            The argument parser instance to add arguments to.
        """
        parser.add_argument("json_file", type=str, help="Path to the JSON file")
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before populating",
        )

    def handle(self, *args: str, **options: Any) -> None:
        """
        Handle the command execution.

        This method is called when the command is executed. It validates the input file,
        checks if it exists, loads and validates the JSON data against the schema,
        and then processes the data to populate the database.

        Parameters
        ----------
        *args : tuple
            Variable length argument list.
        **options : dict
            Keyword arguments containing the command options.
            Expected keys: 'json_file' (str), 'clear' (bool).

        Raises
        ------
        CommandError
            If the file doesn't exist, contains invalid JSON, or fails schema validation.
        """
        json_file = str(options["json_file"])
        clear = bool(options.get("clear", False))

        # Check if input file exists.
        if not os.path.exists(json_file):
            raise CommandError(f"File {json_file} does not exist")

        # Load and parse JSON data.
        try:
            # Resolve the absolute path to handle any relative paths
            json_path = os.path.abspath(json_file)
            self.stdout.write(self.style.SUCCESS(f"Loading data from: {json_path}"))
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f"File not found: {json_file}"))
            self.stderr.write(
                self.style.ERROR(f"Current working directory: {os.getcwd()}")
            )
            return
        except json.JSONDecodeError as e:
            self.stderr.write(self.style.ERROR(f"Invalid JSON in {json_file}: {e}"))
            return
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error reading file {json_file}: {e}"))
            return

        # Validate against schema.
        try:
            validate(instance=data, schema=SCHEMA)
            self.stdout.write(self.style.SUCCESS("Schema validation passed"))
        except ValidationError as e:
            raise CommandError(f"Validation error: {e}")

        self.stdout.write("Processing data...")

        # MARK: - Process Data Sections.
        if "organizations" in data:
            self._process_organizations(data["organizations"], clear)

        # Process groups.
        if "groups" in data:
            self._process_groups(data["groups"], clear)

        # Process events.
        if "events" in data:
            self._process_events(data["events"], clear)

        # Process global resources.
        if "resources" in data:
            self._process_global_resources(data["resources"], clear)

        self.stdout.write(self.style.SUCCESS("Successfully populated database"))

    def _process_organizations(
        self, organizations: List[Dict[str, Any]], clear: bool
    ) -> None:
        """
        Import and process organization data from the provided JSON.

        Parameters
        ----------
        organizations : List[Dict[str, Any]]
            List of organization data to process.
        clear : bool
            Flag indicating whether to clear existing data before processing.
        """
        self.stdout.write(f"Processing {len(organizations)} organizations...")
        if clear:
            self.stdout.write("Clearing existing organizations...")
            # Add code to clear existing organizations.

        for org in organizations:
            try:
                self.stdout.write(
                    f"  - Processing organization: {org['name'].get('en', '')}"
                )
                # Add code to create/update organization.
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error processing organization {org.get('id')}: {e}"
                    )
                )

    def _process_groups(self, groups: List[Dict[str, Any]], clear: bool) -> None:
        """
        Import and process group data from the provided JSON.

        Parameters
        ----------
        groups : List[Dict[str, Any]]
            List of group data to process.
        clear : bool
            Flag indicating whether to clear existing data before processing.
        """
        self.stdout.write(f"Processing {len(groups)} groups...")
        if clear:
            self.stdout.write("Clearing existing groups...")
            # Add code to clear existing groups.

        for group in groups:
            try:
                self.stdout.write(
                    f"  - Processing group: {group['name'].get('en', '')}"
                )
                # Add code to create/update group.
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing group {group.get('id')}: {e}")
                )

    def _process_events(self, events: List[Dict[str, Any]], clear: bool) -> None:
        """
        Import and process event data from the provided JSON.

        Parameters
        ----------
        events : List[Dict[str, Any]]
            List of event data to process.
        clear : bool
            Flag indicating whether to clear existing data before processing.
        """
        self.stdout.write(f"Processing {len(events)} events...")
        if clear:
            self.stdout.write("Clearing existing events...")
            # Add code to clear existing events.

        for event in events:
            try:
                self.stdout.write(
                    f"  - Processing event: {event['title'].get('en', '')}"
                )
                # Add code to create/update event.
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error processing event {event.get('id')}: {e}")
                )

    def _process_global_resources(
        self, resources: List[Dict[str, Any]], clear: bool
    ) -> None:
        """
        Import and process global resource data from the provided JSON.

        Parameters
        ----------
        resources : List[Dict[str, Any]]
            List of global resource data to process.
        clear : bool
            Flag indicating whether to clear existing data before processing.
        """
        self.stdout.write(f"Processing {len(resources)} global resources...")
        if clear:
            self.stdout.write("Clearing existing global resources...")
            # Add code to clear existing global resources.

        for resource in resources:
            try:
                self.stdout.write(
                    f"  - Processing global resource: {resource['title'].get('en', '')}"
                )
                # Add code to create/update global resource.
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error processing resource {resource.get('id')}: {e}"
                    )
                )
