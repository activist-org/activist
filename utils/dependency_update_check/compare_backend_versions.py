# SPDX-License-Identifier: AGPL-3.0-or-later
"""
Ran as a part of the dependency_update_check GitHub Action to derive potential backend updates.
"""

import json
import os
import re
import subprocess
from pathlib import Path

PYPROJECT_PATH = Path("pyproject.toml")


def apply_constraints(max_versions: dict[str, str]) -> str | None:
    if not max_versions:
        return None

    original = PYPROJECT_PATH.read_text()
    constraints = ", ".join(f'"{pkg}<={ver}"' for pkg, ver in max_versions.items())
    constraint_line = f"constraint-dependencies = [{constraints}]\n"

    if match := re.search(r"^\[tool\.uv\]\n", original, flags=re.MULTILINE):
        insert_at = match.end()
        updated = original[:insert_at] + constraint_line + original[insert_at:]
    else:
        updated = original + f"\n[tool.uv]\n{constraint_line}"

    PYPROJECT_PATH.write_text(updated)

    return original


def restore_pyproject(original: str | None) -> None:
    if original is not None:
        PYPROJECT_PATH.write_text(original)


def capture_and_pint_uv_upgrades() -> None:
    """
    Capture the output of uv lock --upgrade to derive potential backend package upgrades.

    Returns
    -------
    None
        The package names, their new version and their old version are printed.
    """
    result = subprocess.run(
        ["uv", "lock", "--upgrade"], capture_output=True, text=True, check=True
    )

    combined_output = result.stdout + "\n" + result.stderr

    # Matches: "Updated <dep> <old_ver> -> <new_ver>".
    pattern = re.compile(r"Updated\s+(\S+)\s+v?(\S+)\s+->\s+v?(\S+)")

    for line in combined_output.splitlines():
        if match := pattern.search(line):
            dep, old_ver, new_ver = match.groups()

            print(f"| {dep} | {old_ver} | {new_ver} | Backend |")


if __name__ == "__main__":
    max_versions = json.loads(os.environ.get("BACKEND_MAX_VERSIONS", "{}"))
    original_pyproject = apply_constraints(max_versions)

    try:
        capture_and_pint_uv_upgrades()
    finally:
        restore_pyproject(original_pyproject)
