# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Main module for checking Django models against TypeScript types.
"""

from typing import Dict, List, Set

from .django_parser import extract_model_fields
from .typescript_parser import TypeScriptParser
from .utils import snake_to_camel


class TypeChecker:
    """
    Main class for checking Django models against TypeScript types.

    Parameters
    ----------
    models_file : str
        The file path for the models file to check.

    types_file : str
        The file path for the TypeScript file to check.
    """

    def __init__(self, models_file: str, types_file: str) -> None:
        self.models_file = models_file
        self.types_file = types_file
        self.model_fields = extract_model_fields(models_file)
        self.ts_parser = TypeScriptParser(types_file)
        self.ts_interfaces = self.ts_parser.parse_interfaces()
        self.backend_only = self.ts_parser.get_backend_only_fields()

    def check(self) -> List[str]:
        """
        Check models against TypeScript types.

        Returns
        -------
        list
            A list of fields missing from the TypeScript file.
        """
        missing_fields = []

        for model_name, fields in self.model_fields.items():
            interfaces = self._find_matching_interfaces(model_name)

            if not interfaces:
                missing_fields.append(
                    self._format_missing_interface_message(model_name)
                )
                continue

            missing_fields.extend(
                self._format_missing_field_message(field, model_name, interfaces)
                for field in fields
                if not self._is_field_accounted_for(field, interfaces)
            )

        return missing_fields

    def _find_matching_interfaces(self, model_name: str) -> Dict[str, Set[str]]:
        """
        Find matching TypeScript interfaces for a model.

        Parameters
        ----------
        model_name : str
            The name of the model to check the frontend TypeScript file for.

        Returns
        -------
        Dict[str, Set[str]]
            Interfaces that match a model name.
        """
        potential_names = self._generate_potential_names(model_name)
        return {
            name: interface.fields
            for name, interface in self.ts_interfaces.items()
            if any(potential == name for potential in potential_names)
        }

    @staticmethod
    def _generate_potential_names(model_name: str) -> List[str]:
        """
        Generate potential TypeScript interface names for a model.

        Parameters
        ----------
        model_name : str
            The name of the model to check the frontend TypeScript file for.

        Returns
        -------
        List[str]
            Possible names for the model to check for.
        """
        base_names = [
            model_name,
            model_name.replace("Model", ""),
        ]

        if "_" in model_name:
            base_names.append(snake_to_camel(input_str=model_name))

        suffixes = ["", "Base", "Response", "Type"]
        return [f"{base}{suffix}" for base in base_names for suffix in suffixes]

    def _is_field_accounted_for(
        self, field: str, interfaces: Dict[str, Set[str]]
    ) -> bool:
        """
        Check if a field is accounted for in TypeScript.

        Parameters
        ----------
        field : str
            The field that should be used in the frontend TypeScript file.

        interfaces : Dict[str, Set[str]]
            The interfaces from the frontend TypeScript file.

        Returns
        -------
        Bool
            Whether the field is accounted for in the frontend TypeScript file.
        """
        camel_field = snake_to_camel(input_str=field)
        return (
            camel_field in self.backend_only
            or field in self.backend_only
            or any(camel_field in fields for fields in interfaces.values())
        )

    @staticmethod
    def _format_missing_interface_message(model_name: str) -> str:
        """
        Format message for missing interface.

        Parameters
        ----------
        model_name : str
            The name of the model that an interface is missing from.

        Returns
        -------
        str
            The message displayed to the user when missing interfaces are found.
        """
        potential_names = TypeChecker._generate_potential_names(model_name)
        return (
            f"\nNo matching TypeScript interface found for model: {model_name}\n"
            f"Searched for interfaces: {', '.join(potential_names)}"
        )

    @staticmethod
    def _format_missing_field_message(
        field: str, model_name: str, interfaces: Dict[str, Set[str]]
    ) -> str:
        """
        Format message for missing field.

        Parameters
        ----------
        field : str
            The model field that's missing.

        model_name : str
            The name of the model that the field is missing from.

        interfaces : Dict[str, Set[str]]
            The interfaces that have been searched.

        Returns
        -------
        str
            The message displayed to the user when missing fields are found.
        """
        camel_field = snake_to_camel(input_str=field)
        return (
            f"\nField '{field}' (camelCase: '{camel_field}') from model '{model_name}' "
            f"is missing in TypeScript types.\n"
            f"Expected to find in interface(s): {', '.join(interfaces.keys())}\n"
            f"To ignore this field, add a comment that references it like: '// Note: {camel_field} is backend only'"
        )
