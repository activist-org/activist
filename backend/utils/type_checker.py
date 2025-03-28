# SPDX-License-Identifier: AGPL-3.0-or-later

# Script to check backend models field against corresponding frontend TypeScript files field.
import ast
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


def main():
    print("In progress....")


if __name__ == "__main__":
    main()
