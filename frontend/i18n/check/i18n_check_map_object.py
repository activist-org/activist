# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Checks the i18nMap object to make sure that it's in sync with the base localization file.

Usage:
    python3 frontend/i18n/check/i18n_check_map_object.py
"""

import json
from collections.abc import MutableMapping
from pathlib import Path

# MARK: Load Base i18n

i18n_check_dir = Path(__file__).parent.parent.resolve()
with open(i18n_check_dir / "en-US.json", encoding="utf-8") as f:
    en_us_json_dict = json.loads(f.read())

flat_en_us_json_dict = {k: k for k, _ in en_us_json_dict.items()}

# MARK: Load i18n Map

frontend_types_dir = (Path(__file__).parent.parent.parent / "types").resolve()
with open(frontend_types_dir / "i18n-map.ts", encoding="utf-8") as f:
    i18n_object_list = f.readlines()

    i18n_object_list_with_key_quotes = []
    for i, line in enumerate(i18n_object_list):
        if i != 0 or i != len(i18n_object_list):
            if line.strip()[0] != '"':
                i18n_object_list_with_key_quotes.append(
                    f'"{line.replace(":", '":').strip()}'
                )

            else:
                i18n_object_list_with_key_quotes.append(
                    f"{line.replace(':', '":').strip()}"
                )

    i18n_object = (
        "".join(i18n_object_list_with_key_quotes)
        .replace('"// SPDX-License-Identifier": ', "")
        .replace("AGPL-3.0-or-later", "")
        .replace("export const i18nMap = ", "")
        .replace("};", "}")
        .replace('"{', "{")
        .replace('"}', "}")
        .replace(",}", "}")
    )
    i18n_object_dict = json.loads(i18n_object)


# MARK: Flatten i18n Obj


def flatten_nested_dict(
    dictionary: MutableMapping, parent_key: str = "", sep: str = "."
) -> MutableMapping:
    """
    Flattens a nested dictionary.

    Parameters
    ----------
    d : MutableMapping
        The nested dictionary to flatten.

    parent_key : str
        The key of the current value being flattened.

    sep : str
        The separator to be used to join the nested keys.

    Returns
    -------
    MutableMapping
        The flattened version of the given nested dictionary.
    """
    items = []
    for k, v in dictionary.items():
        new_key = parent_key + sep + k if parent_key else k
        if isinstance(v, MutableMapping):
            items.extend(flatten_nested_dict(v, new_key, sep=sep).items())

        else:
            items.append((new_key, v))

    return dict(items)


flat_i18n_object_dict = flatten_nested_dict(i18n_object_dict)

# MARK: Compare Dicts

assert (
    flat_en_us_json_dict == flat_i18n_object_dict
), "\ncheck_map_object failure: The current i18nMap object doesn't match the base en-US source file. Please re-generate the i18nMap object.\n"

print(
    "check_map_object success: The current i18nMap object matches the en-US source file."
)
