# SPDX-License-Identifier: AGPL-3.0-or-later
# Script to check backend models against frontend TypeScript types.
import argparse
import ast
import re
from typing import Dict, List, Set, Tuple


def snake_to_camel(snake_case: str) -> str:
    # Convert snake_case to camelCase.
    components = snake_case.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


class ModelVisitor(ast.NodeVisitor):
    # Identifies model fields.
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


def extract_typescript_fields(ts_file: str) -> Tuple[Dict[str, Set[str]], Set[str]]:
    """
    Extract TypeScript interface fields and backend-only fields from a TypeScript file.

    Args:
        ts_file: Path to the TypeScript file to analyze

    Returns:
        A tuple containing:
        - Dictionary mapping interface names to their complete set of fields (including inherited)
        - Set of fields marked as "backend only" in comments
    """
    # Read the TypeScript file
    with open(ts_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Step 1: Extract all interfaces with their direct fields and parent relationships
    interface_data = _extract_interface_definitions(content)

    # Step 2: Resolve inheritance relationships to get complete field sets
    resolved_interfaces = _resolve_interface_inheritance(interface_data)

    # Step 3: Extract fields marked as "backend only" in comments
    backend_only_fields = _extract_backend_only_fields(content)

    return resolved_interfaces, backend_only_fields


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


def _extract_backend_only_fields(content: str) -> set[str]:
    """Extract fields marked as 'backend only' in comments."""
    # Find both formats: "Note: isPrivate is backend only" and "isPrivate is backend only"
    patterns = [
        r"//.*?Note:\s+(\w+)\s+is\s+backend\s+only",
        r"//.*?(\w+)\s+is\s+backend\s+only",
    ]

    backend_only = set()
    for pattern in patterns:
        backend_only.update(re.findall(pattern, content))

    return backend_only


def _content_contains_field(content: str, field: str) -> bool:
    """
    Check if the content contains a field, even in places outside interface definitions.
    This handles cases where fields might be in type definitions or other structures.
    """
    # Simple check for exact field name
    field_pattern = r"\b" + re.escape(field) + r"\b"
    return bool(re.search(field_pattern, content))


def check_models_against_types(models_file: str, types_file: str) -> List[str]:
    """
    Compare Python model fields with TypeScript interface fields.

    Args:
        models_file (str): Path to the Python models file.
        types_file (str): Path to the TypeScript types file.

    Returns:
        List of missing or inconsistent fields.
    """
    # Parse model fields
    with open(models_file, "r", encoding="utf-8") as f:
        tree = ast.parse(f.read())

    visitor = ModelVisitor()
    visitor.visit(tree)
    model_fields = visitor.models

    # Read the TypeScript file content for string search fallback
    with open(types_file, "r", encoding="utf-8") as f:
        ts_content = f.read()

    # Parse TypeScript interfaces
    ts_interfaces, backend_only = extract_typescript_fields(types_file)

    missing_fields = []

    # Process each Python model
    for model_name, fields in model_fields.items():
        # Generate potential matching TypeScript interface names
        potential_interfaces = [
            model_name,  # Exact match
            f"{model_name}Base",  # Base interface
            f"{model_name}Response",  # Response interface
            model_name.replace("Model", ""),  # Remove "Model" suffix if present
        ]

        # Convert Python model name to camelCase for additional matching
        if "_" in model_name:
            camel_model = "".join(
                word.capitalize() if i > 0 else word.lower()
                for i, word in enumerate(model_name.split("_"))
            )
            potential_interfaces.extend(
                [camel_model, f"{camel_model}Base", f"{camel_model}Response"]
            )

        # Check for any matching interface
        matched_interfaces = {}
        for interface_name in ts_interfaces:
            if interface_name in potential_interfaces:
                matched_interfaces[interface_name] = ts_interfaces[interface_name]

        if not matched_interfaces:
            missing_fields.append(
                f"No matching TypeScript interface found for model: {model_name}"
            )
            continue

        # Check if each model field exists in at least one matching interface
        for field in fields:
            camel_field = snake_to_camel(field)

            # Skip if field is marked as backend only
            if camel_field in backend_only:
                continue

            # Check if field exists in any of the matched interfaces
            field_found = False
            for interface_name, interface_fields in matched_interfaces.items():
                if camel_field in interface_fields:
                    field_found = True
                    break

            # If not found in interfaces, check if it exists elsewhere in the file
            if not field_found and _content_contains_field(ts_content, camel_field):
                field_found = True

            # Report missing field
            if not field_found:
                missing_fields.append(
                    f"Field '{field}' (camelCase: '{camel_field}') from model '{model_name}' "
                    f"is missing in TypeScript types"
                )

    return missing_fields


def main():
    """
    Main function to parse arguments and run model-type comparison.
    """
    parser = argparse.ArgumentParser(
        description="Check model fields against TypeScript types"
    )
    parser.add_argument("models_file", help="Path to models.py")
    parser.add_argument("types_file", help="Path to TypeScript types file")
    parser.add_argument(
        "--verbose", "-v", action="store_true", help="Show detailed output"
    )
    args = parser.parse_args()

    missing = check_models_against_types(args.models_file, args.types_file)

    if args.verbose:
        print(f"Checking {args.models_file} against {args.types_file}")

    if missing:
        print("Missing TypeScript fields found:")
        print("\n".join(missing))
        exit(1)

    print("All model fields are properly typed in TypeScript!")


if __name__ == "__main__":
    main()
