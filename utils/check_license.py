# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Checks project to assure that all files have an SPDX-License-Identifier.

Usage:
    python3 utils/check_license.py
"""

import contextlib
import itertools
import os
from pathlib import Path

# MARK: Paths / Files

# Check for Windows and derive directory path separator.
path_separator = "\\" if os.name == "nt" else "/"

root_dir = Path(__file__).parent.parent
backend_directory = Path(__file__).parent.parent / "backend"
frontend_directory = Path(__file__).parent.parent / "frontend"

directories_to_skip = [
    str((root_dir / ".mypy_cache").resolve()),
    str((backend_directory / ".mypy_cache").resolve()),
    str((backend_directory / "htmlcov").resolve()),
    str((frontend_directory / ".nuxt").resolve()),
    str((frontend_directory / "node_modules").resolve()),
]

SPDX_ID_DICT = {
    ".py": "# SPDX-License-Identifier: AGPL-3.0-or-later",
    ".vue": "<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->",
    ".js": "// SPDX-License-Identifier: AGPL-3.0-or-later",
    ".mjs": "// SPDX-License-Identifier: AGPL-3.0-or-later",
    ".ts": "// SPDX-License-Identifier: AGPL-3.0-or-later",
}

files_to_check_without = []
files_to_check_should_not_have = []
for root, dir, files in itertools.chain(
    os.walk(backend_directory), os.walk(frontend_directory)
):
    if all(root[: len(d)] != d for d in directories_to_skip):
        for f in files:
            for t in list(SPDX_ID_DICT.keys()):
                if f[-len(t) :] == t:
                    if f != "__init__.py":
                        files_to_check_without.append(os.path.join(root, f))

                    else:
                        files_to_check_should_not_have.append(os.path.join(root, f))

files_to_check_should_not_have += files_to_check_without

# MARK: Files Missing ID

files_without_spdx_id = []
for file_to_check in files_to_check_without:
    with open(file_to_check, mode="r") as f:
        first_line = f.readline()
        with contextlib.suppress(IndexError):
            first_line = first_line[:-1] if first_line[-1] == "\n" else first_line
            files_without_spdx_id.extend(
                file_to_check
                for k, v in SPDX_ID_DICT.items()
                if file_to_check[-len(k) :] == k and v != first_line
            )

if files_without_spdx_id:
    print(
        "Some files are missing or have an incorrect SPDX license identifier as the first line:\n"
    )
    for i, f in enumerate(files_without_spdx_id):
        print(f"{i + 1}. {f}")

    print()

else:
    print("All files have a correct SPDX license identifier as the first line.")

# MARK: Files Wrong ID

files_should_not_have_spdx_id = []
for file_to_check in files_to_check_should_not_have:
    if file_to_check[-len("__init__.py") :] == "__init__.py":
        with open(file_to_check, mode="r") as f:
            first_line = f.readline()
            with contextlib.suppress(IndexError):
                first_line = first_line[:-1] if first_line[-1] == "\n" else first_line
                files_should_not_have_spdx_id.extend(
                    file_to_check
                    for k, v in SPDX_ID_DICT.items()
                    if file_to_check[-len(k) :] == k and v == first_line
                )

if files_should_not_have_spdx_id:
    print(
        "Some files have an SPDX license identifier as the first line that shouldn't:\n"
    )
    for i, f in enumerate(files_should_not_have_spdx_id):
        print(f"{i + 1}. {f}")
