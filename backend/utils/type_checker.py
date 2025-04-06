# SPDX-License-Identifier: AGPL-3.0-or-later

# Script to check backend models field against corresponding frontend TypeScript files field.
import ast
import re
from typing import Dict, Set


def snake_to_camel(snake_case: str) -> str:
    # Convert snake_case to camelCase.
    components = snake_case.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class ModelVisitor(ast.NodeVisitor):
    """
    Extract field names from model classes.
    """

    def __init__(self):
        self.models: Dict[str, Set[str]] = {}
        self.current_model: str | None = None

    def visit_ClassDef(self, node: ast.ClassDef) -> None:
        # Record the current model name when visiting a class definition.

        self.current_model = node.name
        if self.current_model not in self.models:
            self.models[self.current_model] = set()
        self.generic_visit(node)

    def visit_Assign(self, node: ast.Assign) -> None:
        # Extract field names from model.

        if not self.current_model:
            return

        for target in node.targets:
            # Check for valid field assignments
            if (
                isinstance(target, ast.Name)
                and not target.id.startswith("_")
                and isinstance(node.value, ast.Call)
            ):
                # Check for Django model field types
                field_types = [
                    "Field",
                    "ForeignKey",
                    "ManyToManyField",
                    "OneToOneField",
                ]
                if hasattr(node.value.func, "attr") and any(
                    field_type in node.value.func.attr for field_type in field_types
                ):
                    self.models[self.current_model].add(target.id)

    def _extract_interface_definitions(content: str) -> dict:
        """Extract interface definitions with their direct fields and parent interfaces."""
        interfaces = {}
        interface_pattern = (
            r"(?:export\s+)?interface\s+(\w+)(?:\s+extends\s+(\w+))?\s*{([\s\S]*?)}"
        )

        for match in re.finditer(interface_pattern, content):
            interface_name = match.group(1)
            parent_name = match.group(2)  # May be None if no parent
            interface_body = match.group(3)

            # Get both normal and commented fields
            fields = set(re.findall(r"(?://\s*)?(\w+)\s*[?]?\s*:", interface_body))

            interfaces[interface_name] = {"fields": fields, "parent": parent_name}

        return interfaces

    def _resolve_interface_inheritance(interface_data: dict) -> dict[str, set[str]]:
        """Resolve inheritance to create complete field sets for each interface."""
        resolved_interfaces = {}

        for interface_name, data in interface_data.items():
            # Start with the interface's direct fields
            all_fields = set(data["fields"])
            parent_name = data["parent"]

            # Follow the inheritance chain to collect all parent fields
            while parent_name and parent_name in interface_data:
                all_fields.update(interface_data[parent_name]["fields"])
                parent_name = interface_data[parent_name]["parent"]

            resolved_interfaces[interface_name] = all_fields

        return resolved_interfaces


def main():
    print("In progress....")


if __name__ == "__main__":
    main()
