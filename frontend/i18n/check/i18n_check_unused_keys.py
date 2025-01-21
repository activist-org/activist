# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Checks if the en-US.json file has keys that are not used in the codebase.
If yes, suggest that they be removed from the en-US.json.

Usage:
    python3 frontend/i18n/check/i18n_check_unused_keys.py
"""

import json
import os
from pathlib import Path

# MARK: Paths / Files

i18n_check_dir = str(Path(__file__).parent.resolve())
json_file_directory = Path(__file__).parent.parent.resolve()
frontend_directory = Path(__file__).parent.parent.parent.resolve()

directories_to_skip = [
    i18n_check_dir,
    str((frontend_directory / ".nuxt").resolve()),
    str((frontend_directory / "node_modules").resolve()),
]
files_to_skip = ["i18n-map.ts"]
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

# MARK: Unused Keys

all_keys = list(en_us_json_dict.keys())
used_keys = []
for k in all_keys:
    for value in file_to_check_contents.values():
        if k in value:
            used_keys.append(k)

            break

# MARK: Error Outputs

if unused_keys := list(set(all_keys) - set(used_keys)):
    to_be = "are" if len(unused_keys) > 1 else "is"
    key_to_be = "keys that are" if len(unused_keys) > 1 else "key that is"
    key_or_keys = "keys" if len(unused_keys) > 1 else "key"
    raise ValueError(
        f"There {to_be} {len(unused_keys)} i18n {key_to_be} unused. Please remove or assign the following {key_or_keys}:\n\n{', '.join(unused_keys)}\n"
    )

else:
    print(
        "\nSuccess: All i18n keys in the en-US source file are used in the project.\n"
    )
