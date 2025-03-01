# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Checks the i18n keys used in the project and makes sure that each of them appears in the en-US.json file.
If there are invalid keys, alert the user to their presence.

Usage:
    python3 frontend/i18n/check/i18n_check_invalid_keys.py
"""

import json
import os
import re
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

# MARK: Key Comparisons

all_keys = en_us_json_dict.keys()

i18n_key_pattern_quote = r"\'i18n\.[_\S\.]+?\'"
i18n_key_pattern_double_quote = r"\"i18n\.[_\S\.]+?\""
i18n_key_pattern_back_tick = r"\`i18n\.[_\S\.]+?\`"
all_i18n_key_patterns = [
    i18n_key_pattern_quote,
    i18n_key_pattern_double_quote,
    i18n_key_pattern_back_tick,
]

all_used_i18n_keys = []
for v in file_to_check_contents.values():
    all_file_i18n_keys = []
    all_file_i18n_keys.extend(
        re.findall(i18n_kp, v) for i18n_kp in all_i18n_key_patterns
    )
    # Remove the first and last characters that are the quotes or back ticks.
    all_file_i18n_keys = [k[1:-1] for ks in all_file_i18n_keys for k in ks]

    all_used_i18n_keys += all_file_i18n_keys

all_used_i18n_keys = set(all_used_i18n_keys)

if invalid_keys := list(all_used_i18n_keys - all_keys):
    to_be = "are" if len(invalid_keys) > 1 else "is"
    key_to_be = "keys that are" if len(invalid_keys) > 1 else "key that is"
    key_or_keys = "keys" if len(invalid_keys) > 1 else "key"
    raise ValueError(
        f"\ncheck_invalid_keys failure: There {to_be} {len(invalid_keys)} i18n {key_to_be} not in the en-US source file. Please check the validity of the following {key_or_keys}:\n\n{', '.join(invalid_keys)}\n"
    )

else:
    print(
        "check_invalid_keys success: All i18n keys that are used in the project are in the en-US source file."
    )
