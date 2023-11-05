"""
i18n Check Unused Keys

Run `python i18n_check_unused_keys.py` to check if the en-US.json file has keys that are unused.
If yes, then remove those keys from the `en-US.json`.
"""

import json
import os
from pathlib import Path

this_directory = str(Path(__file__).parent.resolve())
frontend_directory = "/".join(this_directory.split("/")[:-1])
directories_to_skip = [this_directory, f"{frontend_directory}/.nuxt", f"{frontend_directory}/node_modules"]
file_types_to_check = [".vue", ".ts", ".js"]

with open(f"{this_directory}/en-US.json") as f:
    en_us_json_dict = json.loads(f.read())

files_to_check = []
for root, dirs, files in os.walk(frontend_directory):
    files_to_check.extend(os.path.join(root, file) for file in files if all(root[:len(d)] != d for d in directories_to_skip) and any(file[-len(t):] == t for t in file_types_to_check))

all_keys = list(en_us_json_dict.keys())
used_keys = []
for k in all_keys:
    for frontend_file in files_to_check:
        with open(frontend_file, "r") as f:
            file_content = f.read()

        if k in file_content:
            used_keys.append(k)

            break

if unused_keys := list(set(all_keys) - set(used_keys)):
    raise ValueError(f"There exist i18n keys that are unused. Please remove or assign {', '.join(unused_keys)}")

else:
    print("\nSuccess: all i18n keys are used in the project.")
