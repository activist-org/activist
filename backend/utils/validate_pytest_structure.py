# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Validate the directory structure and naming conventions of backend Pytest tests.
"""

import os
import re
from pathlib import Path

# Read in the functions of said files
# Validate that functions are named {file_name}_...

PATH_SEPARATOR = "\\" if os.name == "nt" else "/"

backend_dir = Path(__file__).parent.parent
directories_to_check = [
    "communities/groups/tests",
    "communities/organizations/tests",
    "content/tests",
    "events/tests",
]
test_files = []

# MARK: Derive Test Files

for d in directories_to_check:
    for root, dirs, files in os.walk(backend_dir / d):
        if root.split(f"{PATH_SEPARATOR}")[-1] != "__pycache__":
            test_files += [
                str(Path(root) / f).replace(f"{str(backend_dir)}{PATH_SEPARATOR}", "")
                for f in files
                if f != "__init__.py"
            ]

# MARK: Check Files

invalid_file_names_start_with_test = []
invalid_file_names_include_dir_path = []
invalid_file_function_names = []
for f in test_files:
    # Check that files start with test.
    test_file_name = f.split(f"{PATH_SEPARATOR}")[-1]

    if not test_file_name.startswith("test") or test_file_name.startswith("tests"):
        invalid_file_names_start_with_test.append(test_file_name)

    # Check that files include the directory structure that leads to them.
    # Note: We don't include 'communities' and will replace 'organization' with 'org'.
    test_file_dir_path = [
        d for d in f.split(f"{PATH_SEPARATOR}")[:-1] if d != "communities"
    ]
    test_file_app_without_s = (
        test_file_dir_path[0][:-1]
        if test_file_dir_path[0].endswith("s")
        else test_file_dir_path[0]
    )
    sub_dir_path = f"_{test_file_dir_path[2]}" if len(test_file_dir_path) == 3 else ""

    valid_test_file_stub = f"test_{test_file_app_without_s}{sub_dir_path}".replace(
        "organization", "org"
    )
    if not test_file_name.startswith(valid_test_file_stub):
        invalid_file_names_include_dir_path.append(test_file_name)

    # Check that function names start with the file name.
    file_fxn_name_regex = r"\bdef\s([a-zA-Z_]\w*)\("
    with open(backend_dir / f, "r") as file:
        file_contents = file.read()
        file_fxn_names = re.findall(file_fxn_name_regex, file_contents)

    for fxn_name in file_fxn_names:
        if not fxn_name.startswith(test_file_name.replace(".py", "")):
            invalid_file_function_names.append(test_file_name)

# MARK: Validate

if (
    invalid_file_names_start_with_test
    or invalid_file_names_include_dir_path
    or invalid_file_function_names
):
    invalid_file_names = list(
        set(invalid_file_names_start_with_test)
        | set(invalid_file_names_include_dir_path)
        | set(invalid_file_function_names)
    )
    invalid_file_names_str = "\n- " + "\n- ".join(invalid_file_names)
    raise ValueError(
        f"The following files have invalid names or function names:{invalid_file_names_str}"
    )
