# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Generates a TypeScript file with the object i18nMap that maps all i18n keys as properties.
This allows type checking of all i18n keys to assure that they've been entered correctly.

Usage:
    python3 frontend/i18n/check/i18n_generate_map_object.py
"""

import json
import re
from pathlib import Path

# MARK: Paths / Files

i18n_check_dir = Path(__file__).parent.parent.resolve()

with open(i18n_check_dir / "en-US.json", encoding="utf-8") as f:
    en_us_json_dict = json.loads(f.read())

# MARK: Create Map


def _recursively_nest_dict(k: str, v: str | dict, output_dict: dict):
    """
    Recursively nests dictionaries.

    Parameters
    ----------
    k : str
        The key of a sub dictionary.

    v : str | dict
        The value of a nested dictionary.

    output_dict | dict
        The output_dict dictionary or sub-dictionary.
    """
    k, *rest = k.split(".", 1)
    if rest:
        _recursively_nest_dict(rest[0], v, output_dict.setdefault(k, {}))

    else:
        output_dict[k] = v


def nest_flat_dict(flat_dict: dict) -> dict:
    """
    Nest a flat dictionary.

    Parameters
    ----------
    flat_dict : dict
        A flattened dictionary that should be nested.

    Returns
    -------
    nested_dict : dict
        The nested version of the original flat dictionary.
    """
    nested_dict = {}
    for k, v in flat_dict.items():
        _recursively_nest_dict(k=k, v=v, output_dict=nested_dict)

    return nested_dict


i18n_map_dict = nest_flat_dict({k: k for k, _ in en_us_json_dict.items()})

# MARK: Write Map

frontend_types_dir = (Path(__file__).parent.parent.parent / "types").resolve()

with open(frontend_types_dir / "i18n-map.ts", encoding="utf-8", mode="w") as f:
    f.write(
        f"// SPDX-License-Identifier: AGPL-3.0-or-later\nexport const i18nMap = {json.dumps(i18n_map_dict, indent=2)}"
    )

# Rewrite to format the keys to not have quotes.
with open(frontend_types_dir / "i18n-map.ts", encoding="utf-8", mode="r") as f:
    i18n_object = f.readlines()

with open(frontend_types_dir / "i18n-map.ts", encoding="utf-8", mode="w") as f:
    for line in i18n_object:
        f.write(re.sub(r'"([^"]*)":', r"\1:", line))

print("The i18n-map.ts file with the i18nMap object has been successfully written to.")
