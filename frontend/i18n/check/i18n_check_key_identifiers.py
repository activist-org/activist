# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Checks if the en-US.json file has invalid keys given their usage or formatting.
If yes, suggest new names for the keys at the lowest possible level of usage.

Usage:
    python3 frontend/i18n/check/i18n_check_key_identifiers.py
"""

import json
import os
import re
from collections import defaultdict
from pathlib import Path

# MARK: Paths / Files

# Check for Windows and derive directory path separator.
path_separator = "\\" if os.name == "nt" else "/"

i18n_check_dir = str(Path(__file__).parent.resolve())
json_file_directory = Path(__file__).parent.parent.resolve()
frontend_directory = Path(__file__).parent.parent.parent.resolve()

directories_to_skip = [
    i18n_check_dir,
    str((frontend_directory / ".nuxt").resolve()),
    str((frontend_directory / ".output").resolve()),
    str((frontend_directory / "dist").resolve()),
    str((frontend_directory / "node_modules").resolve()),
]
files_to_skip = []
file_types_to_check = [".vue", ".ts", ".js"]

with open(json_file_directory / "en-US.json", encoding="utf-8") as f:
    en_us_json_dict = json.loads(f.read())

files_to_check = []
for root, dirs, files in os.walk(frontend_directory):
    files_to_check.extend(
        os.path.join(root, file)
        for file in files
        if all(root[: len(d)] != d for d in directories_to_skip)
        and any(file[-len(t) :] == t for t in file_types_to_check)
        and file not in files_to_skip
    )

file_to_check_contents = {}
for frontend_file in files_to_check:
    with open(frontend_file, "r", encoding="utf-8") as f:
        file_to_check_contents[frontend_file] = f.read()

# MARK: Key-Files Dict

all_keys = list(en_us_json_dict.keys())
key_file_dict = defaultdict()
for k in all_keys:
    key_file_dict[k] = []
    for i, v in file_to_check_contents.items():
        if k in v:
            filepath_from_src = i.split(str(frontend_directory))[1]
            filepath_from_src = filepath_from_src[1:]
            for file_type in file_types_to_check:
                filepath_from_src = filepath_from_src.replace(file_type, "")

            key_file_dict[k].append(filepath_from_src)

# Note: This removes empty lists that are unused keys as this is handled by i18n_check_unused_keys.
key_file_dict = {k: list(set(v)) for k, v in key_file_dict.items() if len(v) > 0}

# MARK: Invalid Keys


def is_valid_key(s):
    """
    Checks that a i18n key is only lowercase letters, number, periods or underscores.
    """
    pattern = r"^[a-z0-9._]+$"
    return bool(re.match(pattern, s))


def path_to_valid_key(p):
    """
    Converts a path to a valid key with period separators and all words being snake case.

    Note: [id] and [group_id] are removed in this step as it doesn't add anything to keys.
    """
    # Insert underscores between words, but only if the word is preceded by a lowercase letter and followed by an uppercase letter (i.e. except for abbreviations).
    valid_key = ""
    for i, c in enumerate(p):
        if c.isupper():
            if i == 0:
                valid_key += c.lower()

            elif i == len(p) - 1:
                valid_key += f"_{c.lower()}"

            elif p[i - 1].isupper() and p[i + 1].isupper():
                valid_key += c.lower()

            else:
                valid_key += f"_{c.lower()}"

        else:
            valid_key += c

    # Replace path segments like '[id]' that are not useful information for keys.
    valid_key = re.sub(r"\[.*?\]", "", valid_key)

    return (
        valid_key.replace(path_separator, ".")
        .replace("..", ".")
        .replace("._", ".")
        .replace("-", "_")
    )


invalid_keys_by_format = []
invalid_keys_by_name = {}
for k in key_file_dict:
    if not is_valid_key(k):
        invalid_keys_by_format.append(k)

    if len(key_file_dict[k]) == 1:
        formatted_potential_key = path_to_valid_key(key_file_dict[k][0])
        potential_key_parts = formatted_potential_key.split(".")
        valid_key_parts = [
            p
            for p in potential_key_parts
            if f"{p}_" not in potential_key_parts[-1]
            and not (
                p == potential_key_parts[-1][-len(p) :] and p != potential_key_parts[-1]
            )
        ]

        # Get rid of repeat key parts for files that are the same name as their directory.
        valid_key_parts = [p for p in valid_key_parts if valid_key_parts.count(p) == 1]

        ideal_key_base = ".".join(valid_key_parts) + "."

    else:
        formatted_potential_keys = [path_to_valid_key(p) for p in key_file_dict[k]]
        potential_key_parts = [k.split(".") for k in formatted_potential_keys]

        # Match all entries with their counterparts from other valid key parts.
        corresponding_valid_key_parts = list(zip(*potential_key_parts))

        # Append all parts in order so long as all valid keys share the same part.
        extended_key_base = ""
        global_added = False
        for i in range(len(corresponding_valid_key_parts)):
            if len(set(corresponding_valid_key_parts[i])) != 1 and not global_added:
                extended_key_base += "_global."
                global_added = True

            if len(set(corresponding_valid_key_parts[i])) == 1:
                extended_key_base += f"{corresponding_valid_key_parts[i][0]}."

        # Don't include a key part if it's included in the final one (i.e. organizational sub dir).
        extended_key_base_split = extended_key_base.split()
        valid_key_parts = [
            p
            for p in extended_key_base_split
            if f"{p}_" not in extended_key_base_split[-1]
            and not (
                p == extended_key_base_split[-1][-len(p) :]
                and p != extended_key_base_split[-1]
            )
        ]

        ideal_key_base = ".".join(valid_key_parts)

    ideal_key_base = f"i18n.{ideal_key_base}"

    if k[: len(ideal_key_base)] != ideal_key_base:
        ideal_key = f"{ideal_key_base}{k.split('.')[-1]}"
        invalid_keys_by_name[k] = ideal_key

# MARK: Error Outputs

invalid_keys_by_format_string = ", ".join(invalid_keys_by_format)
format_to_be = "are" if len(invalid_keys_by_format) > 1 else "is"
format_key_to_be = "keys that are" if len(invalid_keys_by_format) > 1 else "key that is"
format_key_or_keys = "keys" if len(invalid_keys_by_format) > 1 else "key"

invalid_keys_by_format_error = f"""
There {format_to_be} {len(invalid_keys_by_format)} i18n {format_key_to_be} not formatted correctly. Please reformat the following {format_key_or_keys}:\n\n{invalid_keys_by_format_string}
"""

invalid_keys_by_name_string = "".join(
    f"\n{k} -> {v}" for k, v in invalid_keys_by_name.items()
)
name_to_be = "are" if len(invalid_keys_by_name) > 1 else "is"
name_key_to_be = "keys that are" if len(invalid_keys_by_name) > 1 else "key that is"
name_key_or_keys = "keys" if len(invalid_keys_by_name) > 1 else "key"

invalid_keys_by_name_error = f"""
There {name_to_be} {len(invalid_keys_by_name)} i18n {name_key_to_be} not named correctly. Please rename the following {name_key_or_keys} [current_key -> suggested_correction]:\n{invalid_keys_by_name_string}
"""

error_string = ""

if not invalid_keys_by_format and not invalid_keys_by_name:
    print(
        "check_key_identifiers success: All i18n keys are formatted and named correctly in the en-US source file."
    )

elif invalid_keys_by_format and invalid_keys_by_name:
    error_string += invalid_keys_by_format_error
    error_string += invalid_keys_by_name_error
    raise ValueError(error_string)

else:
    if invalid_keys_by_format:
        error_string += invalid_keys_by_format_error

    else:
        print(
            "\ncheck_key_identifiers failure: There is an error with key names, but all i18n keys are formatted correctly in the en-US source file.\n"
        )

    if invalid_keys_by_name:
        error_string += invalid_keys_by_name_error

    else:
        print(
            "\ncheck_key_identifiers failure: There is an error with key formatting, but all i18n keys are named appropriately in the en-US source file.\n"
        )

    raise ValueError(error_string)
