# SPDX-License-Identifier: AGPL-3.0-or-later
"""Utility functions for type checking."""


def snake_to_camel(snake_case: str) -> str:
    """Convert snake_case to camelCase."""
    components = snake_case.split("_")
    return components[0] + "".join(x.title() for x in components[1:])
