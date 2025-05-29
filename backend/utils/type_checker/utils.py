# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Utility functions for type checking.
"""


def snake_to_camel(input_str: str) -> str:
    """
    Convert snake_case strings to camelCase.

    Parameters
    ----------
    input_str : str
        A string that may be in snake_case.

    Returns
    -------
    str
        The passed string in camelCase.
    """
    components = input_str.split("_")
    return components[0] + "".join(x.title() for x in components[1:])
