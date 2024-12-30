"""
Checks if the i18n target JSON files have keys that are not in es-US.json.
If yes, suggest that they be removed from the their respective JSON files.

Usage:
    python3 frontend/i18n/check/i18n_check_non_source_keys.py
"""

import glob
import json
import os
from pathlib import Path

# MARK: Paths / Files

# Check for Windows and derive directory path separator.
path_separator = "\\" if os.name == "nt" else "/"

json_file_directory = Path(__file__).parent.parent.resolve()

with open(json_file_directory / "en-US.json", encoding="utf-8") as f:
    en_us_json_dict = json.loads(f.read())

all_en_us_keys = en_us_json_dict.keys()

# MARK: Non Source Keys

non_source_keys_dict = {}
for json_file in glob.glob(f"{json_file_directory}{path_separator}*.json"):
    if json_file.split(path_separator)[-1] != "en-US.json":
        with open(json_file, encoding="utf-8") as f:
            json_dict = json.loads(f.read())

        all_keys = json_dict.keys()

        if len(all_keys - all_en_us_keys) > 0:
            non_source_keys_dict[json_file.split(path_separator)[-1]] = (
                all_keys - all_en_us_keys
            )

# MARK: Error Outputs

if non_source_keys_dict:
    non_source_keys_string = "\n\n".join(
        f"{k}: {', '.join(non_source_keys_dict[k])}\nTotal: {len(non_source_keys_dict[k])}"
        for k in non_source_keys_dict
    )
    raise ValueError(
        f"There are some i18n target JSON files that have keys that are not in en-US.json. Please remove or rename the following keys:\n\n{non_source_keys_string}\n"
    )

else:
    print(
        "\nSuccess: No i18n target file has keys that are not in the en-US.json source file.\n"
    )
